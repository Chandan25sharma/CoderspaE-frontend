'use client';
import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

interface Player {
  id: string;
  name: string;
  socketId: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  testCases: Array<{
    input: string;
    expectedOutput: string;
  }>;
  difficulty: string;
  starterCode: {
    javascript: string;
    python: string;
  };
}

interface MatchData {
  battleId: string;
  roomId: string;
  challenge: Challenge;
  players: Player[];
  timeLimit: number;
}

interface BattleResult {
  winner: string;
  player1Time: number;
  player2Time: number;
  battleId: string;
}

export function useBattleSocket() {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'waiting' | 'matched' | 'battle' | 'completed'>('disconnected');
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [opponent, setOpponent] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    if (!session?.user) return;

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:4000';
    console.log('Connecting to socket server:', socketUrl);

    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      timeout: 10000,
      forceNew: true,
    });

    newSocket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      setStatus('connected');
      setError(null);
      reconnectAttempts.current = 0;
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected from Socket.IO server:', reason);
      setStatus('disconnected');
      setError('Connection lost. Attempting to reconnect...');
      
      // Attempt to reconnect
      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current++;
        setTimeout(() => {
          console.log(`Reconnection attempt ${reconnectAttempts.current}`);
          newSocket.connect();
        }, 2000 * reconnectAttempts.current);
      } else {
        setError('Unable to connect to battle server. Please refresh the page.');
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setError('Failed to connect to battle server. Please check your connection.');
      setStatus('disconnected');
    });

    newSocket.on('waiting_for_opponent', () => {
      setStatus('waiting');
    });

    newSocket.on('match_found', (data: MatchData) => {
      console.log('Match found:', data);
      setMatchData(data);
      setStatus('matched');
      
      // Find opponent
      const opponentData = data.players.find(p => p.id !== session.user.id);
      setOpponent(opponentData || null);
      
      // Transition to battle after a short delay
      setTimeout(() => {
        setStatus('battle');
      }, 3000);
    });

    newSocket.on('code_submitted', (data: {
      playerId: string;
      playerName: string;
      completionTime: number;
      hasCompleted: boolean;
    }) => {
      console.log('Code submitted:', data);
      // You can update UI to show that opponent has submitted
    });

    newSocket.on('battle_completed', (result: BattleResult) => {
      console.log('Battle completed:', result);
      setBattleResult(result);
      setStatus('completed');
    });

    newSocket.on('error', (errorData: { message: string }) => {
      console.error('Socket error:', errorData);
      setError(errorData.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [session]);

  const joinQueue = () => {
    if (socket && session?.user) {
      setStatus('waiting');
      setError(null);
      socket.emit('join_queue', {
        userId: session.user.id,
        userName: session.user.name,
      });
    }
  };

  const leaveQueue = () => {
    if (socket) {
      socket.emit('leave_queue');
      setStatus('connected');
    }
  };

  const submitCode = (code: string, language: string = 'javascript') => {
    if (socket && matchData) {
      socket.emit('submit_code', {
        roomId: matchData.roomId,
        battleId: matchData.battleId,
        code,
        language,
      });
    }
  };

  return {
    socket,
    status,
    matchData,
    battleResult,
    opponent,
    error,
    joinQueue,
    leaveQueue,
    submitCode,
    isConnected: socket?.connected || false,
  };
}
