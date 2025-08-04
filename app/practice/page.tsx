'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Play, Clock, Target, Zap, CheckCircle, XCircle, Brain, Code, BookOpen } from 'lucide-react';
import { CodeExecutor } from '@/components/CodeExecutor';
import { TypingMetrics } from '@/components/TypingMetrics';
import { XPProgressBar } from '@/components/XPProgressBar';
import { ConfettiCelebration } from '@/components/ConfettiCelebration';
import { useSession } from 'next-auth/react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'algorithms' | 'web3' | 'ai' | 'data-structures';
  timeLimit: number; // in seconds
  testCases: Array<{
    input: string;
    expectedOutput: string;
    hidden?: boolean;
  }>;
  starterCode: {
    javascript: string;
    python: string;
    java: string;
    cpp: string;
  };
  hints: string[];
  solution?: string;
  xpReward: number;
}

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Two Sum Problem',
    description: 'Given an array of integers and a target sum, return indices of two numbers that add up to the target.',
    difficulty: 'easy',
    category: 'algorithms',
    timeLimit: 300,
    testCases: [
      { input: '[2,7,11,15], 9', expectedOutput: '[0,1]' },
      { input: '[3,2,4], 6', expectedOutput: '[1,2]' },
      { input: '[3,3], 6', expectedOutput: '[0,1]', hidden: true },
    ],
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n    // Your solution here\n    \n}',
      python: 'def two_sum(nums, target):\n    # Your solution here\n    pass',
      java: 'public int[] twoSum(int[] nums, int target) {\n    // Your solution here\n    \n}',
      cpp: 'vector<int> twoSum(vector<int>& nums, int target) {\n    // Your solution here\n    \n}',
    },
    hints: [
      'Consider using a hash map for O(n) solution',
      'Store the complement and its index',
      'Check if current number\'s complement exists in the map'
    ],
    xpReward: 50,
  },
  {
    id: '2',
    title: 'Neural Network Basics',
    description: 'Implement a simple forward pass for a neural network with one hidden layer.',
    difficulty: 'medium',
    category: 'ai',
    timeLimit: 600,
    testCases: [
      { input: '[[1,2]], [[0.5,0.3],[0.2,0.7]], [0.1,0.9]', expectedOutput: '[0.88, 0.95]' },
    ],
    starterCode: {
      javascript: 'function forwardPass(input, weights, biases) {\n    // Implement forward pass\n    \n}',
      python: 'def forward_pass(input_data, weights, biases):\n    # Implement forward pass\n    pass',
      java: 'public double[] forwardPass(double[][] input, double[][] weights, double[] biases) {\n    // Implement forward pass\n    \n}',
      cpp: 'vector<double> forwardPass(vector<vector<double>>& input, vector<vector<double>>& weights, vector<double>& biases) {\n    // Implement forward pass\n    \n}',
    },
    hints: [
      'Use matrix multiplication for input * weights',
      'Add bias terms after multiplication',
      'Apply activation function (sigmoid or ReLU)'
    ],
    xpReward: 100,
  },
];

export default function PracticePage() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<'javascript' | 'python' | 'java' | 'cpp'>('javascript');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<Array<{passed: boolean, output: string}>>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentXP, setCurrentXP] = useState(1250);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && selectedChallenge) {
      interval = setInterval(() => {
        setTimeElapsed(prev => {
          if (prev >= selectedChallenge.timeLimit) {
            setIsRunning(false);
            return selectedChallenge.timeLimit;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, selectedChallenge]);

  const handleStartChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setCode(challenge.starterCode[language]);
    setTimeElapsed(0);
    setTestResults([]);
    setIsRunning(true);
    setShowCelebration(false);
  };

  const handleRunTests = () => {
    if (!selectedChallenge) return;
    
    // Mock test execution
    const results = selectedChallenge.testCases.map((testCase, index) => {
      // Simulate test results (in real app, this would execute the code)
      const passed = Math.random() > 0.3; // 70% pass rate for demo
      return {
        passed,
        output: passed ? testCase.expectedOutput : 'Wrong output'
      };
    });
    
    setTestResults(results);
    
    // Check if all tests passed
    const allPassed = results.every(r => r.passed);
    if (allPassed) {
      setIsRunning(false);
      setCurrentXP(prev => prev + selectedChallenge.xpReward);
      setShowCelebration(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-neon-green';
      case 'medium': return 'text-neon-yellow';
      case 'hard': return 'text-neon-red';
      default: return 'text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'algorithms': return Code;
      case 'ai': return Brain;
      case 'web3': return Target;
      default: return Code;
    }
  };

  if (selectedChallenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="flex h-screen">
          {/* Left Panel - Problem Description */}
          <div className="w-1/3 bg-gray-900 border-r border-gray-700 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setSelectedChallenge(null)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  ← Back to Challenges
                </button>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(selectedChallenge.difficulty)} bg-opacity-20`}>
                  {selectedChallenge.difficulty.toUpperCase()}
                </div>
              </div>

              <h1 className="text-2xl font-bold text-white mb-4">{selectedChallenge.title}</h1>
              <p className="text-gray-300 mb-6">{selectedChallenge.description}</p>

              {/* Test Cases */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Test Cases</h3>
                {selectedChallenge.testCases.filter(tc => !tc.hidden).map((testCase, index) => (
                  <div key={index} className="bg-cyber-light rounded-lg p-4 mb-3">
                    <div className="text-sm text-gray-400 mb-1">Input:</div>
                    <div className="font-mono text-neon-green mb-2">{testCase.input}</div>
                    <div className="text-sm text-gray-400 mb-1">Expected Output:</div>
                    <div className="font-mono text-neon-blue">{testCase.expectedOutput}</div>
                  </div>
                ))}
              </div>

              {/* Hints */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Hints</h3>
                {selectedChallenge.hints.map((hint, index) => (
                  <div key={index} className="flex items-start gap-2 mb-2">
                    <div className="text-neon-yellow">💡</div>
                    <div className="text-gray-300 text-sm">{hint}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Code Editor and Metrics */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="bg-cyber-gray border-b border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <select
                    value={language}
                    onChange={(e) => {
                      const newLang = e.target.value as typeof language;
                      setLanguage(newLang);
                      setCode(selectedChallenge.starterCode[newLang]);
                    }}
                    className="bg-cyber-light border border-gray-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                  </select>
                  
                  <div className="flex items-center gap-2 text-white">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(timeElapsed)} / {formatTime(selectedChallenge.timeLimit)}</span>
                  </div>
                </div>

                <button
                  onClick={handleRunTests}
                  className="px-6 py-2 bg-neon-green text-cyber-dark font-semibold rounded-lg hover:bg-green-400 transition-colors"
                >
                  <Play className="h-4 w-4 inline mr-2" />
                  Run Tests
                </button>
              </div>
            </div>

            <div className="flex flex-1">
              {/* Code Editor */}
              <div className="flex-1">
                <CodeExecutor
                  initialCode={code}
                  language={language}
                  context="practice"
                  height="500px"
                />
              </div>

              {/* Metrics Panel */}
              <div className="w-80 bg-cyber-gray border-l border-gray-700 p-4 overflow-y-auto">
                <TypingMetrics
                  wpm={wpm}
                  accuracy={accuracy}
                  timeElapsed={timeElapsed}
                  errorsCount={errors}
                  isActive={isRunning}
                />

                <div className="mt-6">
                  <XPProgressBar
                    currentXP={currentXP}
                    nextLevelXP={2000}
                    level={Math.floor(currentXP / 500) + 1}
                    animated={true}
                  />
                </div>

                {/* Test Results */}
                {testResults.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Test Results</h3>
                    {testResults.map((result, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        {result.passed ? (
                          <CheckCircle className="h-5 w-5 text-neon-green" />
                        ) : (
                          <XCircle className="h-5 w-5 text-neon-red" />
                        )}
                        <span className="text-white">Test {index + 1}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ConfettiCelebration
          trigger={showCelebration}
          type="achievement"
          onComplete={() => setShowCelebration(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-purple-900 to-cyber-dark p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-12 w-12 text-neon-purple" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">
              Practice Arena
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Sharpen your skills with AI-powered feedback and real-time performance metrics
          </p>
        </motion.div>

        {/* Challenge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockChallenges.map((challenge, index) => {
            const CategoryIcon = getCategoryIcon(challenge.category);
            return (
              <motion.div
                key={challenge.id}
                className="bg-cyber-gray rounded-2xl p-6 border border-gray-700 hover:border-neon-purple/50 transition-all cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleStartChallenge(challenge)}
              >
                <div className="flex items-center justify-between mb-4">
                  <CategoryIcon className="h-8 w-8 text-neon-blue" />
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(challenge.difficulty)} bg-current bg-opacity-20`}>
                    {challenge.difficulty.toUpperCase()}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{challenge.title}</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{challenge.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(challenge.timeLimit)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    <span>{challenge.xpReward} XP</span>
                  </div>
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-neon-purple to-neon-blue text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-neon-purple/30 transition-all">
                  Start Challenge
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
