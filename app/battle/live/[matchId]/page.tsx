'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/hooks/useSocket';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Send, 
  Users, 
  Eye, 
  Clock, 
  Trophy,
  Code,
  Zap,
  Target,
  MessageCircle
} from 'lucide-react';

interface Player {
  id: string;
  name: string;
  avatar?: string;
  code: string;
  isComplete: boolean;
  completedAt?: Date;
  testsPassedCount: number;
}

interface BattleData {
  _id: string;
  title: string;
  problem: {
    title: string;
    description: string;
    constraints: string[];
    examples: Array<{ input: string; output: string; explanation?: string }>;
    testCases: Array<{ input: string; expectedOutput: string; points: number }>;
  };
  players: Player[];
  spectators: string[];
  status: 'waiting' | 'starting' | 'live' | 'finishing' | 'finished';
  timeRemaining: number;
  language: string;
}

interface TestResult {
  passed: boolean;
  error?: string;
  input?: string;
  expected?: string;
  actual?: string;
}

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'system' | 'celebration';
}

export default function LiveBattlePage() {
  const params = useParams();
  const { data: session } = useSession();
  const { socket, isConnected } = useSocket();
  const matchId = params.matchId as string;

  const [battle, setBattle] = useState<BattleData | null>(null);
  const [myCode, setMyCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSpectating, setIsSpectating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showChat, setShowChat] = useState(false);
  
  const codeEditorRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Check if current user is a player or spectator
  useEffect(() => {
    if (battle && session?.user?.id) {
      const isPlayer = battle.players.some(p => p.id === session.user.id);
      setIsSpectating(!isPlayer);
    }
  }, [battle, session]);

  // Socket event listeners
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Join the match room
    socket.emit('join_match', { matchId });

    // Listen for battle updates
    socket.on('battle_update', (data: BattleData) => {
      setBattle(data);
      setTimeLeft(data.timeRemaining);
    });

    // Listen for code updates from other players
    socket.on('code_update', ({ playerId, code }) => {
      setBattle(prev => {
        if (!prev) return prev;
        const updatedPlayers = prev.players.map(player => 
          player.id === playerId ? { ...player, code } : player
        );
        return { ...prev, players: updatedPlayers };
      });
    });

    // Listen for test results
    socket.on('test_results', (results) => {
      setTestResults(results);
      setIsRunning(false);
    });

    // Listen for chat messages
    socket.on('battle_message', (message) => {
      setChatMessages(prev => [...prev, message]);
      scrollChatToBottom();
    });

    // Listen for battle completion
    socket.on('battle_completed', (data) => {
      setBattle(prev => prev ? { ...prev, status: 'finished', ...data } : null);
    });

    return () => {
      socket.off('battle_update');
      socket.off('code_update');
      socket.off('test_results');
      socket.off('battle_message');
      socket.off('battle_completed');
    };
  }, [socket, isConnected, matchId]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && battle?.status === 'live') {
      const timer = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, battle?.status]);

  // Auto-scroll chat
  const scrollChatToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Handle code changes
  const handleCodeChange = (newCode: string) => {
    setMyCode(newCode);
    if (socket && !isSpectating) {
      socket.emit('code_update', { matchId, code: newCode });
    }
  };

  // Run code tests
  const runTests = async () => {
    if (!battle || isSpectating) return;
    
    setIsRunning(true);
    socket?.emit('run_tests', { 
      matchId, 
      code: myCode, 
      language: battle.language 
    });
  };

  // Send chat message
  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return;
    
    socket.emit('battle_message', {
      matchId,
      message: newMessage,
      type: 'message'
    });
    setNewMessage('');
  };

  // Submit solution
  const submitSolution = () => {
    if (!battle || isSpectating) return;
    
    socket?.emit('submit_solution', {
      matchId,
      code: myCode,
      language: battle.language
    });
  };

  // Format time
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!battle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading battle...</p>
        </div>
      </div>
    );
  }

  const opponent = battle.players.find(p => p.id !== session?.user?.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-white">{battle.title}</h1>
            <div className="flex items-center space-x-2 text-orange-400">
              <Clock className="w-5 h-5" />
              <span className="text-xl font-mono">
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              battle.status === 'live' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : battle.status === 'finished'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            }`}>
              {battle.status.toUpperCase()}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-300">
              <Users className="w-5 h-5" />
              <span>{battle.players.length}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Eye className="w-5 h-5" />
              <span>{battle.spectators.length}</span>
            </div>
            <button
              onClick={() => setShowChat(!showChat)}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Side - Problem Description */}
        <div className="w-1/3 bg-gray-800/30 border-r border-gray-700 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-400" />
              {battle.problem.title}
            </h2>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 mb-6 leading-relaxed">
                {battle.problem.description}
              </p>

              {/* Examples */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Examples</h3>
                {battle.problem.examples.map((example, index) => (
                  <div key={index} className="mb-4 bg-gray-900/50 rounded-lg p-4">
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-400">Input:</span>
                      <code className="block mt-1 text-green-400 font-mono bg-gray-800 p-2 rounded">
                        {example.input}
                      </code>
                    </div>
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-400">Output:</span>
                      <code className="block mt-1 text-blue-400 font-mono bg-gray-800 p-2 rounded">
                        {example.output}
                      </code>
                    </div>
                    {example.explanation && (
                      <div>
                        <span className="text-sm font-medium text-gray-400">Explanation:</span>
                        <p className="mt-1 text-gray-300 text-sm">{example.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Constraints</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {battle.problem.constraints.map((constraint, index) => (
                    <li key={index}>{constraint}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Players Status */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white mb-3">Players</h3>
              <div className="space-y-3">
                {battle.players.map((player) => (
                  <div 
                    key={player.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      player.id === session?.user?.id 
                        ? 'bg-blue-500/20 border border-blue-500/30' 
                        : 'bg-gray-700/30'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white font-medium">{player.name}</span>
                      {player.id === session?.user?.id && (
                        <span className="text-xs text-blue-400">(You)</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">
                        {player.testsPassedCount}/{battle.problem.testCases.length} tests
                      </span>
                      {player.isComplete && (
                        <Trophy className="w-4 h-4 text-yellow-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Middle - Code Editor */}
        <div className="flex-1 flex flex-col">
          {/* Editor Header */}
          <div className="bg-gray-800/50 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Code className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">
                {isSpectating ? 'Spectating' : 'Your Solution'} - {battle.language}
              </span>
            </div>
            {!isSpectating && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={runTests}
                  disabled={isRunning}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 rounded-lg transition-colors"
                >
                  {isRunning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Running...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Run Tests</span>
                    </>
                  )}
                </button>
                <button
                  onClick={submitSolution}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  <span>Submit</span>
                </button>
              </div>
            )}
          </div>

          {/* Code Editor */}
          <div className="flex-1 relative">
            <textarea
              ref={codeEditorRef}
              value={isSpectating ? (opponent?.code || '') : myCode}
              onChange={(e) => !isSpectating && handleCodeChange(e.target.value)}
              readOnly={isSpectating}
              className="w-full h-full p-4 bg-gray-900 text-gray-100 font-mono text-sm resize-none focus:outline-none"
              placeholder={isSpectating ? "Watching opponent's code..." : "Write your solution here..."}
              spellCheck={false}
            />
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="bg-gray-800/50 border-t border-gray-700 p-4 max-h-48 overflow-y-auto">
              <h3 className="text-white font-medium mb-3">Test Results</h3>
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      result.passed 
                        ? 'bg-green-500/20 border border-green-500/30' 
                        : 'bg-red-500/20 border border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">Test {index + 1}</span>
                      <span className={`font-medium ${
                        result.passed ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {result.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>
                    {!result.passed && result.error && (
                      <p className="text-red-300 text-sm mt-2">{result.error}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Chat (toggleable) */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-gray-800/30 border-l border-gray-700 flex flex-col"
            >
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-white font-medium">Battle Chat</h3>
              </div>
              
              <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3"
              >
                {chatMessages.map((message, index) => (
                  <div key={index} className="text-sm">
                    <span className="text-blue-400 font-medium">{message.username}:</span>
                    <span className="text-gray-300 ml-2">{message.message}</span>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={sendMessage}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
