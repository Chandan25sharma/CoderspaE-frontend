'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Swords, Trophy, Zap, Clock, Users, Target, Brain, 
  Code, Play, Pause, RotateCcw, Send, MessageSquare,
  Award, TrendingUp, Activity, Eye, Lightbulb, Flame
} from 'lucide-react';
import { CodeEditor } from '../../components/CodeEditor';
import { Timer } from '../../components/Timer';
import Chat from '../../components/Chat';
import { TypingMetrics } from '../../components/TypingMetrics';
import PowerUpBar from '../../components/PowerUpBar';
import ConfettiCelebration from '../../components/ConfettiCelebration';
import GameLayout from '../../components/GameLayout';

interface BattleParticipant {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  rating: number;
  progress: number;
  status: 'coding' | 'thinking' | 'testing' | 'completed';
  typingSpeed: number;
  accuracy: number;
  powerUps: string[];
  streak: number;
}

interface BattleChallenge {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  constraints: string[];
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  starterCode: {
    [key: string]: string;
  };
  timeLimit: number;
  maxAttempts: number;
}

interface AIInsight {
  type: 'hint' | 'optimization' | 'approach' | 'debugging';
  message: string;
  confidence: number;
  timestamp: number;
}

export default function ModernBattlePage() {
  const { data: session } = useSession();
  const [battleId, setBattleId] = useState<string | null>(null);
  const [participants, setParticipants] = useState<BattleParticipant[]>([]);
  const [challenge, setChallenge] = useState<BattleChallenge | null>(null);
  const [currentCode, setCurrentCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [battleStatus, setBattleStatus] = useState<'waiting' | 'active' | 'completed'>('waiting');
  const [myProgress, setMyProgress] = useState(0);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [powerUps, setPowerUps] = useState([
    {
      id: 'freeze',
      name: 'Freeze Opponent',
      description: 'Freeze opponent for 5 seconds',
      icon: 'freeze',
      cost: 100,
      cooldown: 30000,
      currentCooldown: 0,
      available: true,
      owned: 2
    },
    {
      id: 'reveal',
      name: 'Peek',
      description: 'See opponent code for 10 seconds',
      icon: 'reveal',
      cost: 50,
      cooldown: 20000,
      currentCooldown: 0,
      available: true,
      owned: 3
    }
  ]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [coins, setCoins] = useState(500);
  const [typingMetrics, setTypingMetrics] = useState({
    wpm: 0,
    accuracy: 95,
    timeElapsed: 0,
    errorsCount: 0
  });
  
  const editorRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // WebSocket connection for real-time battle updates
  useEffect(() => {
    if (battleId && session) {
      const ws = new WebSocket(`ws://localhost:3001/battle/${battleId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: 'join_battle',
          userId: session.user.id,
          battleId
        }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleBattleUpdate(data);
      };

      return () => {
        ws.close();
      };
    }
  }, [battleId, session]);

  const handleBattleUpdate = (data: any) => {
    switch (data.type) {
      case 'participants_update':
        setParticipants(data.participants);
        break;
      case 'challenge_start':
        setChallenge(data.challenge);
        setTimeRemaining(data.challenge.timeLimit);
        setBattleStatus('active');
        break;
      case 'progress_update':
        updateParticipantProgress(data.userId, data.progress);
        break;
      case 'battle_complete':
        setBattleStatus('completed');
        if (data.winner === session?.user.id) {
          setShowCelebration(true);
        }
        break;
    }
  };

  const updateParticipantProgress = (userId: string, progress: number) => {
    setParticipants(prev => prev.map(p => 
      p.id === userId ? { ...p, progress } : p
    ));
  };

  const handleCodeChange = (code: string) => {
    setCurrentCode(code);
    
    // Calculate progress based on test cases passed
    calculateProgress(code);
    
    // Send real-time typing updates
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'code_update',
        code: code.length, // Send only length for privacy
        progress: myProgress
      }));
    }

    // Get AI insights for complex problems
    if (code.length > 50 && showAIAssistant) {
      requestAIInsights(code);
    }
  };

  const calculateProgress = async (code: string) => {
    if (!challenge || !code.trim()) {
      setMyProgress(0);
      return;
    }

    try {
      // Run code against test cases
      const response = await fetch('/api/code/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language: selectedLanguage,
          testCases: challenge.examples
        })
      });

      const result = await response.json();
      if (result.success) {
        const passedTests = result.results.filter((r: any) => r.passed).length;
        const totalTests = result.results.length;
        const progress = (passedTests / totalTests) * 100;
        
        setMyProgress(progress);
        setTestResults(result.results);
        
        // Update typing metrics
        updateTypingMetrics();
      }
    } catch (error) {
      console.error('Code execution error:', error);
    }
  };

  const requestAIInsights = async (code: string) => {
    try {
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'real_time_feedback',
          code,
          language: selectedLanguage,
          challenge: challenge?.description
        })
      });

      const result = await response.json();
      if (result.success && result.insights.length > 0) {
        setAiInsights(prev => [...prev, ...result.insights.map((insight: any) => ({
          ...insight,
          timestamp: Date.now()
        }))]);
      }
    } catch (error) {
      console.error('AI insights error:', error);
    }
  };

  const updateTypingMetrics = () => {
    // Mock typing metrics calculation
    setTypingMetrics(prev => ({
      wpm: Math.floor(Math.random() * 20) + 60,
      accuracy: Math.floor(Math.random() * 10) + 90,
      timeElapsed: prev.timeElapsed + 1,
      errorsCount: prev.errorsCount + Math.floor(Math.random() * 2)
    }));
  };

  const submitSolution = async () => {
    if (!challenge || !currentCode.trim()) return;

    try {
      const response = await fetch('/api/battle/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          battleId,
          code: currentCode,
          language: selectedLanguage,
          timeSpent: challenge.timeLimit - timeRemaining
        })
      });

      const result = await response.json();
      if (result.success) {
        setBattleStatus('completed');
        if (result.won) {
          setShowCelebration(true);
        }
      }
    } catch (error) {
      console.error('Submit solution error:', error);
    }
  };

  const usePowerUp = (powerUpId: string) => {
    setPowerUps(prev => prev.map(p => 
      p.id === powerUpId 
        ? { ...p, owned: Math.max(0, p.owned - 1), currentCooldown: p.cooldown }
        : p
    ));
    
    switch (powerUpId) {
      case 'freeze':
        // Freeze opponent logic
        console.log('Freezing opponent!');
        break;
      case 'reveal':
        // Reveal opponent code logic
        console.log('Revealing opponent code!');
        break;
    }
  };

  const purchasePowerUp = (powerUpId: string) => {
    const powerUp = powerUps.find(p => p.id === powerUpId);
    if (powerUp && coins >= powerUp.cost) {
      setCoins(prev => prev - powerUp.cost);
      setPowerUps(prev => prev.map(p => 
        p.id === powerUpId ? { ...p, owned: p.owned + 1 } : p
      ));
    }
  };

  const [messages, setMessages] = useState<any[]>([]);
  const [userCount, setUserCount] = useState(2);

  const handleSendMessage = (message: string) => {
    const newMessage = {
      id: Date.now().toString(),
      user: session?.user?.name || 'Anonymous',
      message,
      timestamp: new Date(),
      type: 'message' as const
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendEmote = (emote: string) => {
    const newMessage = {
      id: Date.now().toString(),
      user: session?.user?.name || 'Anonymous',
      message: '',
      timestamp: new Date(),
      type: 'emote' as const,
      emote
    };
    setMessages(prev => [...prev, newMessage]);
  };

  if (!session) {
    return (
      <GameLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Swords className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Ready to Battle?</h2>
            <p className="text-gray-400 mb-6">Sign in to join the coding arena</p>
            <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
              Sign In to Battle
            </button>
          </div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
        {showCelebration && <ConfettiCelebration trigger={showCelebration} />}
        
        <div className="flex h-screen">
          {/* Main Battle Area */}
          <div className="flex-1 flex flex-col">
            {/* Battle Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Swords className="w-6 h-6 text-purple-400" />
                    <span className="text-xl font-bold text-white">Live Battle</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{participants.length} fighters</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Timer */}
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    <Timer
                      timeLimit={timeRemaining}
                      onTimeUp={() => setBattleStatus('completed')}
                    />
                  </div>
                  
                  {/* Battle Status */}
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    battleStatus === 'waiting' ? 'bg-yellow-500/20 text-yellow-400' :
                    battleStatus === 'active' ? 'bg-green-500/20 text-green-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {battleStatus === 'waiting' ? 'Preparing...' :
                     battleStatus === 'active' ? 'Battle Active' : 'Completed'}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Challenge Description */}
            {challenge && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/30 backdrop-blur-sm border-b border-gray-700 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">{challenge.title}</h2>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        challenge.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                        challenge.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {challenge.difficulty.toUpperCase()}
                      </span>
                      <span className="text-gray-400">Max Attempts: {challenge.maxAttempts}</span>
                    </div>
                  </div>
                  
                  {/* Progress Indicator */}
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-1">Your Progress</div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${myProgress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <span className="text-sm font-bold text-white">{Math.round(myProgress)}%</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-3">{challenge.description}</p>
                
                {/* Examples */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {challenge.examples.map((example, idx) => (
                    <div key={idx} className="bg-gray-900/50 rounded-lg p-3">
                      <div className="text-sm text-gray-400 mb-1">Example {idx + 1}</div>
                      <div className="font-mono text-sm">
                        <div className="text-blue-400">Input: <span className="text-gray-300">{example.input}</span></div>
                        <div className="text-green-400">Output: <span className="text-gray-300">{example.output}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Code Editor Area */}
            <div className="flex-1 flex">
              {/* Editor */}
              <div className="flex-1 flex flex-col">
                <div className="bg-gray-800/30 backdrop-blur-sm border-b border-gray-700 p-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Code className="w-4 h-4 text-purple-400" />
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowAIAssistant(!showAIAssistant)}
                      className={`p-2 rounded transition-colors ${
                        showAIAssistant ? 'bg-purple-600 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                      title="AI Assistant"
                    >
                      <Brain className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => calculateProgress(currentCode)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                      title="Test Code"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={submitSolution}
                      disabled={myProgress < 100}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                </div>
                
                <div className="flex-1">
                  <CodeEditor
                    ref={editorRef}
                    language={selectedLanguage}
                    value={currentCode}
                    onChange={handleCodeChange}
                    className="h-full"
                  />
                </div>
              </div>

              {/* Test Results & AI Insights */}
              <div className="w-80 bg-gray-800/30 backdrop-blur-sm border-l border-gray-700 flex flex-col">
                <div className="p-3 border-b border-gray-700">
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-1 bg-gray-700 text-white text-sm rounded">
                      Test Results
                    </button>
                    {showAIAssistant && (
                      <button className="flex-1 px-3 py-1 bg-purple-600 text-white text-sm rounded">
                        AI Insights
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3">
                  {showAIAssistant ? (
                    <div className="space-y-3">
                      {aiInsights.map((insight, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-3"
                        >
                          <div className="flex items-start space-x-2">
                            <Lightbulb className="w-4 h-4 text-purple-400 mt-0.5" />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-purple-300">{insight.type}</div>
                              <div className="text-sm text-gray-300 mt-1">{insight.message}</div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {testResults.map((result, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border ${
                            result.passed 
                              ? 'bg-green-900/20 border-green-500/20 text-green-300'
                              : 'bg-red-900/20 border-red-500/20 text-red-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Test {idx + 1}</span>
                            <span className="text-xs">
                              {result.passed ? '✓ PASSED' : '✗ FAILED'}
                            </span>
                          </div>
                          {result.error && (
                            <div className="text-xs text-gray-400 mt-1">{result.error}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Participants Sidebar */}
          <div className="w-80 bg-gray-800/50 backdrop-blur-sm border-l border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-bold text-white mb-3">Battle Participants</h3>
              <TypingMetrics 
                wpm={typingMetrics.wpm}
                accuracy={typingMetrics.accuracy}
                timeElapsed={typingMetrics.timeElapsed}
                errorsCount={typingMetrics.errorsCount}
              />
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {participants.map((participant) => (
                  <motion.div
                    key={participant.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900/50 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {participant.name[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{participant.name}</div>
                          <div className="text-xs text-gray-400">Level {participant.level}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-yellow-400">{participant.rating}</div>
                        <div className="text-xs text-gray-400">Rating</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Progress</span>
                        <span>{Math.round(participant.progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <motion.div 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-1.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${participant.progress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className={`px-2 py-0.5 rounded ${
                          participant.status === 'coding' ? 'bg-green-500/20 text-green-400' :
                          participant.status === 'thinking' ? 'bg-yellow-500/20 text-yellow-400' :
                          participant.status === 'testing' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {participant.status}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Flame className="w-3 h-3 text-orange-400" />
                          <span className="text-orange-400">{participant.streak}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Power-ups */}
            <div className="p-4 border-t border-gray-700">
              <PowerUpBar 
                powerUps={powerUps} 
                coins={coins}
                onPowerUpUse={usePowerUp}
                onPowerUpPurchase={purchasePowerUp}
              />
            </div>

            {/* Chat Toggle */}
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={() => setShowChat(!showChat)}
                className="w-full flex items-center justify-center space-x-2 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Battle Chat</span>
              </button>
            </div>
          </div>
        </div>

        {/* Chat Overlay */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-4 right-4 w-80 h-96 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl"
            >
              <Chat 
                messages={messages}
                onSendMessage={handleSendMessage}
                onSendEmote={handleSendEmote}
                userCount={userCount}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GameLayout>
  );
}
