import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Socket } from 'socket.io-client';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  testCases: Array<{
    input: string;
    expectedOutput: string;
  }>;
  starterCode: {
    javascript: string;
    python: string;
  };
}

interface TestResult {
  passed: boolean;
  output: string;
}

interface BattleState {
  isConnected: boolean;
  isInQueue: boolean;
  isInBattle: boolean;
  battleId: string | null;
  challenge: Challenge | null;
  opponent: string | null;
  timeRemaining: number;
  code: string;
  language: string;
  testResults: TestResult[];
  error: string | null;
  connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'fallback';
  queuePosition?: number;
}

export function useBattleSystem() {
  const { data: session } = useSession();
  const [state, setState] = useState<BattleState>({
    isConnected: false,
    isInQueue: false,
    isInBattle: false,
    battleId: null,
    challenge: null,
    opponent: null,
    timeRemaining: 300,
    code: '',
    language: 'javascript',
    testResults: [],
    error: null,
    connectionStatus: 'disconnected'
  });

  const [socket, setSocket] = useState<Socket | null>(null);
  const [useFallback, setUseFallback] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  // Initialize connection (try Socket.IO first, fallback to polling)
  const initializeConnection = useCallback(async () => {
    if (!session?.user?.email) return;

    setState(prev => ({ ...prev, connectionStatus: 'connecting' }));

    try {
      // Try Socket.IO connection first
      const { io } = await import('socket.io-client');
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      
      const newSocket = io(backendUrl, {
        transports: ['websocket', 'polling'],
        timeout: 5000,
        retries: 3
      });

      newSocket.on('connect', () => {
        console.log('Connected to battle server');
        setState(prev => ({ 
          ...prev, 
          isConnected: true, 
          connectionStatus: 'connected',
          error: null 
        }));
        setSocket(newSocket);
        setUseFallback(false);
      });

      newSocket.on('connect_error', () => {
        console.log('Socket connection failed, switching to fallback mode');
        setUseFallback(true);
        setState(prev => ({ 
          ...prev, 
          connectionStatus: 'fallback',
          error: 'Using fallback battle system'
        }));
        newSocket.disconnect();
      });

      // Set timeout for connection attempt
      setTimeout(() => {
        if (!newSocket.connected) {
          console.log('Socket connection timeout, using fallback');
          setUseFallback(true);
          setState(prev => ({ 
            ...prev, 
            connectionStatus: 'fallback',
            error: 'Using fallback battle system'
          }));
          newSocket.disconnect();
        }
      }, 5000);

    } catch {
      console.log('Socket.IO not available, using fallback');
      setUseFallback(true);
      setState(prev => ({ 
        ...prev, 
        connectionStatus: 'fallback',
        error: 'Using fallback battle system'
      }));
    }
  }, [session?.user?.email]);

  // Fallback polling for battle updates
  useEffect(() => {
    if (useFallback && state.isInBattle && state.battleId) {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/battle/fallback?action=check-battle&battleId=${state.battleId}`);
          const data = await response.json();
          
          if (data.success && data.battle) {
            setState(prev => ({
              ...prev,
              // Update battle state based on response
              challenge: data.battle.challenge,
              timeRemaining: prev.timeRemaining > 0 ? prev.timeRemaining - 1 : 0
            }));
          }
        } catch (error) {
          console.error('Battle polling error:', error);
        }
      }, 1000);

      setPollingInterval(interval);
      return () => clearInterval(interval);
    }
  }, [useFallback, state.isInBattle, state.battleId]);

  // Leave queue
  const leaveQueue = useCallback(async () => {
    setState(prev => ({ ...prev, isInQueue: false, queuePosition: undefined }));

    if (useFallback) {
      try {
        await fetch('/api/battle/fallback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'leave-queue' })
        });
      } catch (error) {
        console.error('Leave queue error:', error);
      }
    } else if (socket) {
      socket.emit('leave-queue');
    }
  }, [useFallback, socket]);

  // Join battle queue
  const joinQueue = useCallback(async () => {
    if (!session?.user?.email) {
      setState(prev => ({ ...prev, error: 'Please log in to join battles' }));
      return;
    }

    setState(prev => ({ ...prev, isInQueue: true, error: null }));

    if (useFallback) {
      // Use fallback API
      try {
        const response = await fetch('/api/battle/fallback?action=join-queue');
        const data = await response.json();

        if (data.success) {
          if (data.matched) {
            setState(prev => ({
              ...prev,
              isInQueue: false,
              isInBattle: true,
              battleId: data.battleId,
              challenge: data.challenge,
              opponent: data.opponent,
              timeRemaining: Math.floor(data.timeLimit / 1000),
              code: data.challenge.starterCode[prev.language] || ''
            }));
          } else {
            setState(prev => ({
              ...prev,
              queuePosition: data.queuePosition
            }));

            // Poll for match
            const pollForMatch = setInterval(async () => {
              try {
                const pollResponse = await fetch('/api/battle/fallback?action=join-queue');
                const pollData = await pollResponse.json();

                if (pollData.matched) {
                  clearInterval(pollForMatch);
                  setState(prev => ({
                    ...prev,
                    isInQueue: false,
                    isInBattle: true,
                    battleId: pollData.battleId,
                    challenge: pollData.challenge,
                    opponent: pollData.opponent,
                    timeRemaining: Math.floor(pollData.timeLimit / 1000),
                    code: pollData.challenge.starterCode[prev.language] || ''
                  }));
                }
              } catch (error) {
                console.error('Match polling error:', error);
              }
            }, 3000);

            // Stop polling after 2 minutes
            setTimeout(() => {
              clearInterval(pollForMatch);
              if (state.isInQueue) {
                leaveQueue();
              }
            }, 120000);
          }
        }
      } catch (error) {
        console.error('Queue join error:', error);
        setState(prev => ({ 
          ...prev, 
          isInQueue: false, 
          error: 'Failed to join queue' 
        }));
      }
    } else if (socket) {
      // Use Socket.IO
      socket.emit('join-queue');
      
      socket.on('queue-joined', (data: { position: number }) => {
        setState(prev => ({
          ...prev,
          queuePosition: data.position
        }));
      });

      socket.on('battle-matched', (data: { 
        battleId: string; 
        challenge: Challenge; 
        opponent: string; 
        timeLimit: number; 
      }) => {
        setState(prev => ({
          ...prev,
          isInQueue: false,
          isInBattle: true,
          battleId: data.battleId,
          challenge: data.challenge,
          opponent: data.opponent,
          timeRemaining: Math.floor(data.timeLimit / 1000),
          code: data.challenge.starterCode[prev.language as keyof typeof data.challenge.starterCode] || ''
        }));
      });
    }
  }, [session?.user?.email, useFallback, socket, state.isInQueue, leaveQueue]);

  // Submit code
  const submitCode = useCallback(async (code: string) => {
    if (!state.battleId) return;

    if (useFallback) {
      try {
        const response = await fetch('/api/battle/fallback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'submit-code',
            battleId: state.battleId,
            code
          })
        });

        const data = await response.json();
        
        if (data.success) {
          setState(prev => ({
            ...prev,
            testResults: data.testResults,
            isInBattle: !data.allPassed ? prev.isInBattle : false
          }));

          if (data.winner) {
            setState(prev => ({ 
              ...prev, 
              isInBattle: false,
              error: data.winner === session?.user?.email ? 'You won!' : 'You lost!'
            }));
          }
        }
      } catch (error) {
        console.error('Code submission error:', error);
        setState(prev => ({ 
          ...prev, 
          error: 'Failed to submit code' 
        }));
      }
    } else if (socket) {
      socket.emit('submit-code', {
        battleId: state.battleId,
        code,
        language: state.language
      });

      socket.on('code-result', (data: { testResults: TestResult[] }) => {
        setState(prev => ({
          ...prev,
          testResults: data.testResults
        }));
      });

      socket.on('battle-ended', (data: { winner: string }) => {
        setState(prev => ({
          ...prev,
          isInBattle: false,
          error: data.winner === session?.user?.email ? 'You won!' : 'You lost!'
        }));
      });
    }
  }, [state.battleId, state.language, useFallback, socket, session?.user?.email]);

  // Update code
  const updateCode = useCallback((newCode: string) => {
    setState(prev => ({ ...prev, code: newCode }));
  }, []);

  // Update language
  const updateLanguage = useCallback((newLanguage: string) => {
    setState(prev => ({
      ...prev,
      language: newLanguage,
      code: prev.challenge?.starterCode?.[newLanguage as keyof typeof prev.challenge.starterCode] || ''
    }));
  }, []);

  // Timer effect
  useEffect(() => {
    if (state.isInBattle && state.timeRemaining > 0) {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
      }, 1000);

      return () => clearTimeout(timer);
    } else if (state.isInBattle && state.timeRemaining === 0) {
      setState(prev => ({ 
        ...prev, 
        isInBattle: false, 
        error: 'Time\'s up!' 
      }));
    }
  }, [state.isInBattle, state.timeRemaining]);

  // Initialize on mount
  useEffect(() => {
    initializeConnection();

    return () => {
      if (socket) {
        socket.disconnect();
      }
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [initializeConnection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  return {
    ...state,
    joinQueue,
    leaveQueue,
    submitCode,
    updateCode,
    updateLanguage,
    reconnect: initializeConnection
  };
}
