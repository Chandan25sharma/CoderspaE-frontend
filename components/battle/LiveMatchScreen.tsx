'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  CameraOff, 
  Mic, 
  MicOff, 
  Settings, 
  Users, 
  Timer, 
  Code2,
  Play,
  RotateCcw,
  Send,
  Eye,
  Minimize2
} from 'lucide-react';

interface Player {
  id: string;
  name: string;
  avatar: string;
  rank: number;
  wins: number;
  losses: number;
  isReady: boolean;
}

interface MatchState {
  timeRemaining: number;
  isActive: boolean;
  phase: 'waiting' | 'ready' | 'active' | 'finished';
  spectatorCount: number;
}

interface LiveMatchScreenProps {
  matchId: string;
  isSpectator?: boolean;
  playerSide?: 'left' | 'right';
}

const LiveMatchScreen: React.FC<LiveMatchScreenProps> = ({ 
  isSpectator = false
}) => {
  const [matchState, setMatchState] = useState<MatchState>({
    timeRemaining: 1800, // 30 minutes
    isActive: false,
    phase: 'ready',
    spectatorCount: 127
  });
  
  const [viewMode, setViewMode] = useState<'split' | 'left' | 'right'>('split');
  const [showProblem, setShowProblem] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  
  const [players] = useState<{ left: Player; right: Player }>({
    left: {
      id: '1',
      name: 'CodeMaster123',
      avatar: '/api/placeholder/40/40',
      rank: 1247,
      wins: 89,
      losses: 23,
      isReady: true
    },
    right: {
      id: '2',
      name: 'AlgoNinja99',
      avatar: '/api/placeholder/40/40',
      rank: 1156,
      wins: 76,
      losses: 31,
      isReady: true
    }
  });

  const problem = {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "Medium",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      }
    ]
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const spectatorMessages = [
    { id: 1, user: 'ViewerX', message: 'This is intense! 🔥', timestamp: '12:34' },
    { id: 2, user: 'CodeFan', message: 'Left player is using HashSet approach', timestamp: '12:35' },
    { id: 3, user: 'AlgoLover', message: 'Right player debugging...', timestamp: '12:36' }
  ];

  useEffect(() => {
    if (matchState.isActive && matchState.timeRemaining > 0) {
      const timer = setInterval(() => {
        setMatchState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [matchState.isActive, matchState.timeRemaining]);

  const PlayerCard: React.FC<{ player: Player; side: 'left' | 'right' }> = ({ player, side }) => (
    <motion.div
      className={`bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 border-2 ${
        side === 'left' ? 'border-blue-500' : 'border-purple-500'
      }`}
      initial={{ opacity: 0, x: side === 'left' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${
          side === 'left' ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500'
        } flex items-center justify-center`}>
          <span className="text-white font-bold text-sm">
            {player.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h3 className="font-bold text-white">{player.name}</h3>
          <p className="text-gray-400 text-sm">Rank #{player.rank}</p>
        </div>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-green-400">{player.wins}W</span>
        <span className="text-red-400">{player.losses}L</span>
        <span className="text-yellow-400">
          {Math.round((player.wins / (player.wins + player.losses)) * 100)}%
        </span>
      </div>
    </motion.div>
  );

  const CodeEditor: React.FC<{ side: 'left' | 'right'; isActive: boolean }> = ({ side, isActive }) => (
    <div className={`bg-gray-900 rounded-xl p-4 h-[600px] border-2 ${
      side === 'left' ? 'border-blue-500/30' : 'border-purple-500/30'
    } relative overflow-hidden`}>
      {/* Camera Feed */}
      <motion.div
        className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg border-2 border-gray-600 overflow-hidden z-10"
        whileHover={{ scale: 1.05 }}
        drag
        dragConstraints={{ left: 0, right: 200, top: 0, bottom: 400 }}
      >
        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
          <Camera className="w-6 h-6 text-gray-400" />
        </div>
        <div className="absolute bottom-1 left-1 right-1 flex gap-1">
          <button className="flex-1 p-1 bg-gray-700/80 rounded text-xs">
            <Camera className="w-3 h-3 mx-auto text-white" />
          </button>
          <button className="flex-1 p-1 bg-gray-700/80 rounded text-xs">
            <Mic className="w-3 h-3 mx-auto text-white" />
          </button>
        </div>
      </motion.div>

      {/* Code Editor Area */}
      <div className="h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold ${side === 'left' ? 'text-blue-400' : 'text-purple-400'}`}>
            {side === 'left' ? players.left.name : players.right.name}
          </h3>
          <div className="flex gap-2">
            <button className="p-1 bg-gray-700 rounded hover:bg-gray-600">
              <Play className="w-4 h-4 text-green-400" />
            </button>
            <button className="p-1 bg-gray-700 rounded hover:bg-gray-600">
              <RotateCcw className="w-4 h-4 text-yellow-400" />
            </button>
          </div>
        </div>

        {/* Mock Code */}
        <div className="font-mono text-sm space-y-1 text-gray-300 bg-gray-950 p-4 rounded-lg h-[500px] overflow-auto">
          <div className="text-purple-400">{'//'} Two Sum Solution</div>
          <div className="text-blue-400">function</div> <span className="text-yellow-400">twoSum</span>
          <span className="text-gray-300">(nums, target) {'{'}</span>
          <div className="pl-4 text-gray-400">{'//'} Hash map approach</div>
          <div className="pl-4">
            <span className="text-blue-400">const</span> <span className="text-white">map</span> 
            <span className="text-gray-300"> = </span>
            <span className="text-blue-400">new</span> <span className="text-yellow-400">Map</span>
            <span className="text-gray-300">();</span>
          </div>
          <div className="pl-4">
            <span className="text-blue-400">for</span>
            <span className="text-gray-300"> (</span>
            <span className="text-blue-400">let</span> <span className="text-white">i</span>
            <span className="text-gray-300"> = </span>
            <span className="text-green-400">0</span>
            <span className="text-gray-300">; i &lt; nums.length; i++) {'{'}</span>
          </div>
          <div className="pl-8">
            <span className="text-blue-400">const</span> <span className="text-white">complement</span>
            <span className="text-gray-300"> = target - nums[i];</span>
          </div>
          <div className="pl-8">
            <span className="text-blue-400">if</span>
            <span className="text-gray-300"> (map.has(complement)) {'{'}</span>
          </div>
          <div className="pl-12">
            <span className="text-blue-400">return</span>
            <span className="text-gray-300"> [map.get(complement), i];</span>
          </div>
          <div className="pl-8 text-gray-300">{'}'}</div>
          <div className="pl-8 text-gray-300">map.set(nums[i], i);</div>
          <div className="pl-4 text-gray-300">{'}'}</div>
          <div className="text-gray-300">{'}'}</div>
          
          {/* Live typing indicator */}
          {isActive && (
            <motion.div
              className="inline-block w-2 h-4 bg-green-400"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </div>

        {/* Output Panel */}
        <div className="mt-4 bg-gray-950 rounded-lg p-3 h-24">
          <div className="text-green-400 text-sm font-mono">
            Output: [0, 1]
          </div>
          <div className="text-gray-400 text-xs mt-1">
            ✅ Test case 1 passed • Runtime: 68ms
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Match Info */}
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-white">Live Match</h1>
              <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                <span className="text-red-400 font-semibold">LIVE</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Eye className="w-4 h-4" />
                <span>{matchState.spectatorCount} watching</span>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-xl">
                <Timer className="w-5 h-5 text-yellow-400" />
                <span className="text-2xl font-mono font-bold text-white">
                  {formatTime(matchState.timeRemaining)}
                </span>
              </div>

              {/* View Controls */}
              {isSpectator && (
                <div className="flex gap-2">
                  {['split', 'left', 'right'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode as 'split' | 'left' | 'right')}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        viewMode === mode
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {mode === 'split' ? 'Split' : mode === 'left' ? 'Player 1' : 'Player 2'}
                    </button>
                  ))}
                </div>
              )}

              {/* Settings */}
              <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Problem Statement (Collapsible) */}
          <AnimatePresence>
            {showProblem && (
              <motion.div
                className="col-span-12 lg:col-span-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 sticky top-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Problem</h2>
                    <button
                      onClick={() => setShowProblem(false)}
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                    >
                      <Minimize2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-white mb-2">{problem.title}</h3>
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                        {problem.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {problem.description}
                    </p>
                    
                    <div>
                      <h4 className="font-semibold text-white mb-2">Example:</h4>
                      <div className="bg-gray-900 p-3 rounded-lg font-mono text-sm">
                        <div className="text-gray-400">Input: {problem.examples[0].input}</div>
                        <div className="text-gray-400">Output: {problem.examples[0].output}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content Area */}
          <div className={showProblem ? 'col-span-12 lg:col-span-9' : 'col-span-12'}>
            {/* Player Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <PlayerCard player={players.left} side="left" />
              <PlayerCard player={players.right} side="right" />
            </div>

            {/* Code Editors */}
            <div className={`grid gap-6 ${
              viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
            }`}>
              {(viewMode === 'split' || viewMode === 'left') && (
                <CodeEditor side="left" isActive={matchState.isActive} />
              )}
              {(viewMode === 'split' || viewMode === 'right') && (
                <CodeEditor side="right" isActive={matchState.isActive} />
              )}
            </div>
          </div>

          {/* Chat/Spectator Panel */}
          {isSpectator && (
            <div className="col-span-12 lg:col-span-3">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 h-[400px] flex flex-col">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Live Chat
                  </h3>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {spectatorMessages.map((msg) => (
                    <div key={msg.id} className="text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-blue-400">{msg.user}</span>
                        <span className="text-gray-500 text-xs">{msg.timestamp}</span>
                      </div>
                      <p className="text-gray-300">{msg.message}</p>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t border-gray-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Problem Toggle */}
        {!showProblem && (
          <motion.button
            onClick={() => setShowProblem(true)}
            className="fixed bottom-6 left-6 p-3 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg transition-colors z-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Code2 className="w-6 h-6 text-white" />
          </motion.button>
        )}

        {/* Player Controls (if not spectator) */}
        {!isSpectator && (
          <motion.div
            className="fixed bottom-6 right-6 flex gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button
              onClick={() => setIsCameraOn(!isCameraOn)}
              className={`p-3 rounded-full shadow-lg transition-colors ${
                isCameraOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isCameraOn ? (
                <Camera className="w-6 h-6 text-white" />
              ) : (
                <CameraOff className="w-6 h-6 text-white" />
              )}
            </button>
            
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3 rounded-full shadow-lg transition-colors ${
                isMicOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isMicOn ? (
                <Mic className="w-6 h-6 text-white" />
              ) : (
                <MicOff className="w-6 h-6 text-white" />
              )}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LiveMatchScreen;
