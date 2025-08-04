'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Timer, Trophy, Eye, Zap, Play, Code, Crown, Target } from 'lucide-react';
import { CodeExecutor } from '@/components/CodeExecutor';
import { useSession } from 'next-auth/react';

interface Player {
  id: string;
  username: string;
  avatar: string;
  language: 'javascript' | 'python' | 'java' | 'cpp';
  testsPassed: number;
  totalTests: number;
  accuracy: number;
  wpm: number;
  status: 'coding' | 'testing' | 'finished';
  rank: number;
  progress: number;
}

interface BattleProblem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation: string;
  }>;
  timeLimit: number;
  starterCode: {
    javascript: string;
    python: string;
    java: string;
    cpp: string;
  };
}

const mockProblem: BattleProblem = {
  id: 'two-sum-advanced',
  title: "Two Sum Problem",
  difficulty: "medium",
  description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
    }
  ],
  timeLimit: 1800, // 30 minutes
  starterCode: {
    javascript: `function twoSum(nums, target) {
    // Your solution here
    
}`,
    python: `def two_sum(nums, target):
    # Your solution here
    pass`,
    java: `public int[] twoSum(int[] nums, int target) {
    // Your solution here
    
}`,
    cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    // Your solution here
    
}`
  }
};

const MirrorArenaPage = () => {
  const { data: session } = useSession();
  const [gamePhase, setGamePhase] = useState<'waiting' | 'battle' | 'finished'>('waiting');
  const [timeLeft, setTimeLeft] = useState(mockProblem.timeLimit);
  const [spectatorCount, setSpectatorCount] = useState(0); // Changed from 156 to 0
  const [revealPercentage, setRevealPercentage] = useState(25);
  const [isSpectator, setIsSpectator] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'python' | 'java' | 'cpp'>('javascript');
  
  // Remove dummy players when no real battle is active
  const [players] = useState<Player[]>([]);

  // Timer effect
  useEffect(() => {
    if (gamePhase === 'battle' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGamePhase('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gamePhase, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getLanguageColor = (language: string) => {
    switch (language) {
      case 'python': return 'bg-green-500';
      case 'javascript': return 'bg-yellow-500';
      case 'java': return 'bg-orange-500';
      case 'cpp': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const joinBattle = () => {
    setGamePhase('battle');
    setIsSpectator(false);
  };

  const spectate = () => {
    setIsSpectator(true);
    setGamePhase('battle');
  };

  if (gamePhase === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
            >
              Mirror Arena: Live Battle
            </motion.h1>
            <p className="text-xl text-gray-300">
              Code side by side with other developers in real-time
            </p>
          </div>

          {/* Battle Info */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto bg-gray-800 rounded-xl border border-gray-700 p-8 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{mockProblem.title}</h2>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(mockProblem.difficulty)} bg-opacity-20 border`}>
                  {mockProblem.difficulty.toUpperCase()}
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-400">
                <div className="flex items-center gap-2">
                  <Timer size={20} />
                  <span>{formatTime(mockProblem.timeLimit)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={20} />
                  <span>{players.length} players</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye size={20} />
                  <span>{spectatorCount} watching</span>
                </div>
              </div>
            </div>

            <p className="text-gray-300 mb-6">{mockProblem.description}</p>

            {/* Examples */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Examples</h3>
              {mockProblem.examples.map((example, index) => (
                <div key={index} className="bg-gray-900 rounded-lg p-4 mb-3 border border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Input:</div>
                      <div className="text-green-400 font-mono text-sm">{example.input}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Output:</div>
                      <div className="text-blue-400 font-mono text-sm">{example.output}</div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="text-sm text-gray-400 mb-1">Explanation:</div>
                    <div className="text-gray-300 text-sm">{example.explanation}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Current Players */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Current Players</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {players.map((player) => (
                  <div key={player.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{player.avatar}</div>
                        <div>
                          <div className="font-medium text-white">{player.username}</div>
                          <div className={`text-xs px-2 py-1 rounded ${getLanguageColor(player.language)} text-white`}>
                            {player.language.toUpperCase()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Ready</div>
                        <div className="text-green-400">✓</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={joinBattle}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                <Play size={20} />
                Join Battle
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={spectate}
                className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                <Eye size={20} />
                Spectate ({spectatorCount})
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (gamePhase === 'battle') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        {/* Battle Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">{mockProblem.title}</h1>
              <div className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(mockProblem.difficulty)} bg-opacity-20 border`}>
                {mockProblem.difficulty.toUpperCase()}
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-red-400">
                <Timer size={20} />
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Eye size={16} />
                <span>{spectatorCount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-80px)]">
          {/* Left Sidebar - Problem & Leaderboard */}
          <div className="w-80 bg-gray-900 border-r border-gray-700 overflow-y-auto">
            <div className="p-4">
              {/* Problem Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Problem</h3>
                <p className="text-gray-300 text-sm mb-4">{mockProblem.description}</p>
                
                {mockProblem.examples.map((example, index) => (
                  <div key={index} className="bg-gray-800 rounded p-3 mb-3 text-xs">
                    <div className="text-gray-400">Input:</div>
                    <div className="text-green-400 font-mono mb-2">{example.input}</div>
                    <div className="text-gray-400">Output:</div>
                    <div className="text-blue-400 font-mono">{example.output}</div>
                  </div>
                ))}
              </div>

              {/* Live Leaderboard */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Trophy size={20} className="text-yellow-400" />
                  Live Rankings
                </h3>
                <div className="space-y-3">
                  {players.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gray-800 rounded-lg p-3 border border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {index === 0 && <Crown size={16} className="text-yellow-400" />}
                          <span className="text-lg">{player.avatar}</span>
                          <span className="font-medium text-sm">{player.username}</span>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded ${getLanguageColor(player.language)} text-white`}>
                          {player.language}
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tests:</span>
                          <span className="text-green-400">{player.testsPassed}/{player.totalTests}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Accuracy:</span>
                          <span className="text-blue-400">{player.accuracy}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">WPM:</span>
                          <span className="text-purple-400">{player.wpm}</span>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-2">
                        <div className="bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${player.progress}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Code Area */}
          <div className="flex-1 flex flex-col">
            {!isSpectator ? (
              <div className="h-full p-4">
                <div className="mb-4 flex items-center justify-between">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value as typeof selectedLanguage)}
                    className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                  </select>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Your rank: #1</span>
                    <span>Tests passed: 2/4</span>
                  </div>
                </div>
                
                <CodeExecutor
                  initialCode={mockProblem.starterCode[selectedLanguage]}
                  language={selectedLanguage}
                  context="battle"
                  height="calc(100vh - 200px)"
                />
              </div>
            ) : (
              <div className="h-full p-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold">Spectator Mode</h3>
                  <p className="text-gray-400">Watch players code in real-time</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                  {players.map((player) => (
                    <div key={player.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                      <div className="bg-gray-700 p-3 border-b border-gray-600">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{player.avatar}</span>
                            <span className="font-medium">{player.username}</span>
                          </div>
                          <div className={`text-xs px-2 py-1 rounded ${getLanguageColor(player.language)} text-white`}>
                            {player.language}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 h-64 overflow-hidden">
                        <div className="bg-gray-900 rounded p-3 h-full relative">
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                            <div className="text-center">
                              <Eye size={24} className="mx-auto mb-2 text-gray-500" />
                              <div className="text-sm text-gray-500">Limited view ({revealPercentage}%)</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MirrorArenaPage;
