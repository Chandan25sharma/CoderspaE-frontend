'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Eye, Trophy, Clock, Code, Zap } from 'lucide-react';
import io, { Socket } from 'socket.io-client';

interface Player {
  id: string;
  name: string;
  socketId: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  testCases: any[];
  starterCode: Record<string, string>;
}

interface BattleData {
  battleId: string;
  roomId: string;
  challenge: Challenge;
  players: Player[];
  timeLimit: number;
  battleType: string;
  prizePool?: number;
}

interface EnhancedBattleProps {
  userId?: string;
  userName?: string;
  isPremium?: boolean;
}

export default function EnhancedBattle({ userId, userName, isPremium }: EnhancedBattleProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isInQueue, setIsInQueue] = useState(false);
  const [battleData, setBattleData] = useState<BattleData | null>(null);
  const [battleType, setBattleType] = useState<'casual' | 'premium' | 'ai-challenge'>('casual');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [opponentCode, setOpponentCode] = useState('');
  const [myCode, setMyCode] = useState('');
  const [keyStrokes, setKeyStrokes] = useState(0);
  const [isSpectating, setIsSpectating] = useState(false);
  const [spectatorData, setSpectatorData] = useState<any>(null);
  const [liveBattles, setLiveBattles] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) return;

    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://coderspae.com');
    setSocket(newSocket);

    // Listen for match found
    newSocket.on('match_found', (data: BattleData) => {
      setBattleData(data);
      setIsInQueue(false);
      setTimeRemaining(data.timeLimit);
      setMyCode(data.challenge.starterCode.javascript || '');
    });

    // Listen for waiting status
    newSocket.on('waiting_for_opponent', () => {
      setIsInQueue(true);
    });

    // Listen for real-time code updates
    newSocket.on('code:update', (data: any) => {
      if (data.playerId !== userId) {
        setOpponentCode(data.code);
      }
    });

    // Listen for battle completion
    newSocket.on('battle_completed', (data: any) => {
      const isWinner = data.winner === userId;
      alert(isWinner ? '🎉 You won!' : '😔 You lost!');
      
      if (isWinner && data.prizeAwarded > 0) {
        alert(`💰 You earned $${data.prizeAwarded}!`);
      }
      
      setBattleData(null);
      setTimeRemaining(0);
    });

    // Listen for spectator events
    newSocket.on('spectate_joined', (data: any) => {
      setSpectatorData(data);
      setIsSpectating(true);
    });

    // Error handling
    newSocket.on('error', (error: any) => {
      alert(error.message);
      setIsInQueue(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1000);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  // Fetch live battles for spectating
  useEffect(() => {
    const fetchLiveBattles = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/battles/live/spectate`);
        const data = await response.json();
        setLiveBattles(data.battles || []);
      } catch (error) {
        console.error('Error fetching live battles:', error);
      }
    };

    fetchLiveBattles();
    const interval = setInterval(fetchLiveBattles, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const joinQueue = () => {
    if (!socket || !userId || !userName) return;

    // Check if premium features are accessible
    if (battleType === 'ai-challenge' && !isPremium) {
      alert('AI challenges require a premium subscription!');
      return;
    }

    socket.emit('join_queue', {
      userId,
      userName,
      battleType,
    });
  };

  const leaveQueue = () => {
    if (!socket) return;
    socket.emit('leave_queue');
    setIsInQueue(false);
  };

  const submitCode = () => {
    if (!socket || !battleData) return;

    const linesOfCode = myCode.split('\n').length;
    
    socket.emit('submit_code', {
      roomId: battleData.roomId,
      battleId: battleData.battleId,
      code: myCode,
      keyStrokes,
      linesOfCode,
    });
  };

  const spectateeBattle = (battleId: string) => {
    if (!socket) return;
    socket.emit('spectate_battle', { battleId });
  };

  const handleCodeChange = (newCode: string) => {
    setMyCode(newCode);
    setKeyStrokes(prev => prev + 1);
    
    // Emit real-time code updates for spectators
    if (socket && battleData) {
      socket.emit('code:update', {
        roomId: battleData.roomId,
        playerId: userId,
        code: newCode,
        keyStrokes: keyStrokes + 1,
      });
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isSpectating && spectatorData) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Spectating Battle</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              {spectatorData.players[0].name} vs {spectatorData.players[1].name}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {formatTime(spectatorData.timeRemaining)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-4">{spectatorData.players[0].name}</h3>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm overflow-auto h-64">
              {spectatorData.currentCode.player1}
            </pre>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-4">{spectatorData.players[1].name}</h3>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm overflow-auto h-64">
              {spectatorData.currentCode.player2}
            </pre>
          </div>
        </div>

        <button
          onClick={() => setIsSpectating(false)}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Exit Spectator Mode
        </button>
      </div>
    );
  }

  if (battleData) {
    const opponent = battleData.players.find(p => p.id !== userId);
    
    return (
      <div className="max-w-7xl mx-auto p-6">
        {/* Battle Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{battleData.challenge.title}</h2>
              <p className="opacity-90">vs {opponent?.name}</p>
              {battleData.prizePool && (
                <div className="flex items-center mt-2">
                  <Trophy className="w-4 h-4 mr-2" />
                  Prize Pool: ${battleData.prizePool}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-3xl font-mono">{formatTime(timeRemaining)}</div>
              <div className="text-sm opacity-90">Time Remaining</div>
            </div>
          </div>
        </div>

        {/* Battle Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Challenge Description */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Challenge</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {battleData.challenge.description}
            </p>
            
            <h4 className="font-semibold mb-2">Test Cases:</h4>
            <div className="space-y-2">
              {battleData.challenge.testCases.map((test, index) => (
                <div key={index} className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm">
                  <div><strong>Input:</strong> {test.input}</div>
                  <div><strong>Expected:</strong> {test.expectedOutput}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Code Editor */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Your Solution</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Code className="w-4 h-4 mr-1" />
                  {keyStrokes} keystrokes
                </div>
                <div className="flex items-center">
                  <Zap className="w-4 h-4 mr-1" />
                  {myCode.split('\n').length} lines
                </div>
              </div>
            </div>
            
            <textarea
              value={myCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="w-full h-64 p-4 bg-gray-100 dark:bg-gray-700 rounded font-mono text-sm"
              placeholder="Write your solution here..."
            />
            
            <button
              onClick={submitCode}
              className="mt-4 w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all"
            >
              Submit Solution
            </button>
          </div>
        </div>

        {/* Real-time Opponent Code (for premium users) */}
        {isPremium && opponentCode && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Opponent&apos;s Code (Live)</h3>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm overflow-auto h-32">
              {opponentCode}
            </pre>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">⚔️ Real-Time Coding Battles</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Challenge developers worldwide in live coding competitions
        </p>
      </div>

      {/* Battle Type Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Choose Battle Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setBattleType('casual')}
            className={`p-4 rounded-lg border-2 transition-all ${
              battleType === 'casual'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="text-lg font-semibold">🎮 Casual Battle</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Free • Standard challenges • Rating changes
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setBattleType('premium')}
            className={`p-4 rounded-lg border-2 transition-all ${
              battleType === 'premium'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="text-lg font-semibold">💎 Premium Battle</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              $10 entry • Winner takes $18 • Exclusive challenges
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setBattleType('ai-challenge')}
            disabled={!isPremium}
            className={`p-4 rounded-lg border-2 transition-all ${
              battleType === 'ai-challenge'
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700'
            } ${!isPremium ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="text-lg font-semibold">🤖 AI Challenge</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Premium only • AI-generated problems • Advanced difficulty
            </div>
          </motion.button>
        </div>
      </div>

      {/* Queue Status */}
      {isInQueue ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Finding Opponent...</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Searching for a worthy challenger in the {battleType} queue
          </p>
          <button
            onClick={leaveQueue}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Leave Queue
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">Ready to Battle?</h3>
          <button
            onClick={joinQueue}
            disabled={!userId}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!userId ? 'Sign In to Battle' : 'Join Battle Queue'}
          </button>
        </div>
      )}

      {/* Live Battles for Spectating */}
      {liveBattles.length > 0 && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Live Battles - Spectate
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveBattles.slice(0, 6).map((battle) => (
              <div
                key={battle._id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{battle.challengeTitle}</h4>
                  <span className={`px-2 py-1 rounded text-xs ${
                    battle.battleType === 'premium' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {battle.battleType}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {battle.player1.name} vs {battle.player2.name}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {battle.spectatorCount} watching
                  </span>
                  <button
                    onClick={() => spectateeBattle(battle._id)}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                  >
                    Spectate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
