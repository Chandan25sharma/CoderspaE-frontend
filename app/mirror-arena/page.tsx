'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Timer, Trophy, Eye, Zap } from 'lucide-react';
import BattleView from '../../components/BattleView';
import { CodeEditor } from '../../components/CodeEditor';

// Mock data - replace with real data from your backend
const mockProblem = {
  title: "Two Sum Problem",
  difficulty: "Medium" as const,
  description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
    }
  ],
  testCases: [
    { input: "[2,7,11,15], 9", output: "[0,1]" },
    { input: "[3,2,4], 6", output: "[1,2]" },
    { input: "[3,3], 6", output: "[0,1]" }
  ]
};

const MirrorArenaPage = () => {
  const [gamePhase, setGamePhase] = useState<'waiting' | 'battle' | 'finished'>('waiting');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [spectatorCount, setSpectatorCount] = useState(23);
  const [revealPercentage, setRevealPercentage] = useState(20);
  const [isSpectator, setIsSpectator] = useState(false);
  
  const [players, setPlayers] = useState([
    {
      id: 'player1',
      username: 'PytonMaster',
      avatar: '/api/placeholder/32/32',
      language: 'python' as const,
      code: `def two_sum(nums, target):
    # Your solution here
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`,
      testsPassed: 2,
      totalTests: 3,
      accuracy: 67,
      isReady: true,
      isWinner: false,
    },
    {
      id: 'player2',
      username: 'CppCoder',
      avatar: '/api/placeholder/32/32',
      language: 'cpp' as const,
      code: `#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.find(complement) != map.end()) {
            return {map[complement], i};
        }
        map[nums[i]] = i;
    }
    return {};
}`,
      testsPassed: 3,
      totalTests: 3,
      accuracy: 100,
      isReady: true,
      isWinner: false,
    }
  ]);

  // Timer countdown
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

  // Mock spectator count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSpectatorCount(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStartBattle = () => {
    setGamePhase('battle');
  };

  const handleJoinAsSpectator = () => {
    setIsSpectator(true);
  };

  const handleCodeChange = (playerId: string, code: string) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, code } : p
    ));
  };

  const handleRunCode = (playerId: string) => {
    // Mock code execution
    const player = players.find(p => p.id === playerId);
    if (player) {
      // Simulate test results
      const passed = Math.floor(Math.random() * 3) + 1;
      setPlayers(prev => prev.map(p => 
        p.id === playerId ? { 
          ...p, 
          testsPassed: passed,
          accuracy: Math.round((passed / 3) * 100)
        } : p
      ));
    }
  };

  const handlePeekToggle = (playerId: string) => {
    setRevealPercentage(prev => prev === 20 ? 100 : 20);
  };

  if (gamePhase === 'waiting') {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">🪞 Mirror Arena</h1>
                <p className="text-gray-400">Real-time code battles with dual language support</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <Users size={16} />
                  <span>{spectatorCount} watching</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Problem Statement */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="text-yellow-400" size={24} />
                <h2 className="text-xl font-bold">Today&apos;s Challenge</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{mockProblem.title}</h3>
                    <span className="px-2 py-1 bg-yellow-600 text-black rounded text-xs font-semibold">
                      {mockProblem.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-300">{mockProblem.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Example:</h4>
                  <div className="bg-gray-900 border border-gray-600 rounded p-3 font-mono text-sm">
                    <div className="text-green-400">Input: {mockProblem.examples[0].input}</div>
                    <div className="text-blue-400">Output: {mockProblem.examples[0].output}</div>
                    <div className="text-gray-400 mt-1">{mockProblem.examples[0].explanation}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Test Cases:</h4>
                  <div className="space-y-2">
                    {mockProblem.testCases.map((test, index) => (
                      <div key={index} className="bg-gray-900 border border-gray-600 rounded p-2 font-mono text-xs">
                        <span className="text-green-400">Input: {test.input}</span>
                        <span className="text-blue-400 ml-4">Expected: {test.output}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Join Options */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Battle Mode Selection */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Join the Battle</h2>
                
                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStartBattle}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all"
                  >
                    🥋 Join as Coder
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleJoinAsSpectator}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all"
                  >
                    👀 Watch as Spectator
                  </motion.button>
                </div>

                <div className="mt-6 text-sm text-gray-400">
                  <h3 className="font-semibold mb-2">Battle Rules:</h3>
                  <ul className="space-y-1">
                    <li>• 10-minute time limit</li>
                    <li>• Choose Python or C++</li>
                    <li>• Real-time code visibility</li>
                    <li>• Spectators can peek with limitations</li>
                    <li>• Winner determined by test cases passed + speed</li>
                  </ul>
                </div>
              </div>

              {/* Current Players */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Current Fighters</h3>
                <div className="space-y-3">
                  {players.map((player, index) => (
                    <div key={player.id} className="flex items-center justify-between bg-gray-900 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {player.username[0]}
                        </div>
                        <div>
                          <div className="font-semibold">{player.username}</div>
                          <div className="text-xs text-gray-400 uppercase">{player.language}</div>
                        </div>
                      </div>
                      <div className="text-green-400 text-sm">Ready</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spectator Features */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Eye className="text-purple-400" />
                  Spectator Features
                </h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Peek at code with 20% visibility</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Real-time test case results</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Live chat with other spectators</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Vote for coding style points</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <BattleView
        mode="mirror"
        players={players}
        currentPlayer={isSpectator ? undefined : 'player1'}
        timeLeft={timeLeft}
        totalTime={600}
        phase={gamePhase}
        spectatorCount={spectatorCount}
        problemTitle={mockProblem.title}
        problemDifficulty={mockProblem.difficulty}
        revealPercentage={revealPercentage}
        isSpectator={isSpectator}
        onCodeChange={handleCodeChange}
        onRunCode={handleRunCode}
        onPeekToggle={handlePeekToggle}
      />
    </div>
  );
};

export default MirrorArenaPage;
