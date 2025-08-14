'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Play, Clock, Target, Zap, CheckCircle, XCircle, Brain, Code, BookOpen, Search, Link, ArrowLeft } from 'lucide-react';
import { CodeExecutor } from '@/components/CodeExecutor';
import { TypingMetrics } from '@/components/TypingMetrics';
import { XPProgressBar } from '@/components/XPProgressBar';
import { ConfettiCelebration } from '@/components/ConfettiCelebration';

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

// Fallback challenges in case API fails
const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficulty: 'easy',
    category: 'algorithms',
    timeLimit: 300,
    testCases: [
      {
        input: '[2,7,11,15], 9',
        expectedOutput: '[0,1]'
      },
      {
        input: '[3,2,4], 6',
        expectedOutput: '[1,2]'
      }
    ],
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n    // Your code here\n}',
      python: 'def two_sum(nums, target):\n    # Your code here\n    pass',
      java: 'public int[] twoSum(int[] nums, int target) {\n    // Your code here\n}',
      cpp: 'vector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n}'
    },
    hints: ['Use a hash map to store values and indices'],
    xpReward: 50
  }
];

export default function PracticePage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<'javascript' | 'python' | 'java' | 'cpp'>('javascript');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<Array<{passed: boolean, output: string}>>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentXP, setCurrentXP] = useState(1250);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const challengesPerPage = 50;

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  
  const categories = ['algorithms', 'web3', 'ai', 'data-structures'];

  // Fetch challenges from API
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/practice/challenges');
        const data = await response.json();
        
        if (data.success) {
          // Convert API response to our Challenge interface
          const convertedChallenges: Challenge[] = data.challenges.map((challenge: {
            id?: string;
            _id?: string;
            title: string;
            description: string;
            difficulty: string;
            category: string;
            timeLimit?: number;
            xpReward?: number;
          }) => ({
            id: challenge.id || challenge._id,
            title: challenge.title,
            description: challenge.description,
            difficulty: challenge.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard',
            category: challenge.category.toLowerCase().replace(/\s+/g, '-') as 'algorithms' | 'web3' | 'ai' | 'data-structures',
            timeLimit: (challenge.timeLimit || 30) * 60, // Convert minutes to seconds
            testCases: [
              { input: 'Example input', expectedOutput: 'Expected output' }
            ],
            starterCode: {
              javascript: 'function solve() {\n    // Your solution here\n    \n}',
              python: 'def solve():\n    # Your solution here\n    pass',
              java: 'public void solve() {\n    // Your solution here\n    \n}',
              cpp: 'void solve() {\n    // Your solution here\n    \n}',
            },
            hints: [
              'Think about the problem step by step',
              'Consider edge cases',
              'Optimize for time complexity'
            ],
            xpReward: challenge.xpReward || 50,
          }));
          setChallenges(convertedChallenges);
        } else {
          // Use fallback challenges if API fails
          setChallenges(mockChallenges);
        }
        } catch (error) {
          console.error('Error fetching challenges:', error);
          // Use fallback challenges on error
          setChallenges(mockChallenges);
        } finally {
          setLoading(false);
        }
      };

      fetchChallenges();
    }, []);  // Timer effect
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
    const results = selectedChallenge.testCases.map((testCase) => {
  
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

  // Filter and search challenges
  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         challenge.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDifficulty = difficultyFilter === 'all' || challenge.difficulty === difficultyFilter;
    const matchesCategory = categoryFilter === 'all' || challenge.category === categoryFilter;
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredChallenges.length / challengesPerPage);
  const startIndex = (currentPage - 1) * challengesPerPage;
  const endIndex = startIndex + challengesPerPage;
  const paginatedChallenges = filteredChallenges.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, difficultyFilter, categoryFilter]);

  if (selectedChallenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-950 to-black">
        <div className="flex h-screen">
          {/* Left Panel - Problem Description */}
          <div className="w-1/5 bg-gray-900 border-r border-gray-700 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setSelectedChallenge(null)}
                  className="text-white hover:text-blue-300 transition-colors"
                >
                  ← Back
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
            <div className="bg-cyber-gray border-b border-gray-700 p-2">
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
                  className="px-6 py-2 bg-neon-green text-cyber-dark font-semibold rounded-lg hover:bg-gray-800 transition-colors"
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
              <div className="w-50 bg-cyber-gray border-l border-gray-700 p-4 overflow-y-auto">
                <TypingMetrics
                  wpm={0}
                  accuracy={100}
                  timeElapsed={timeElapsed}
                  errorsCount={0}
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-950 to-black">
      <div className="container mx-auto px-4 py-2">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
            Practice Challenges
          </span>
        </h1>
        <p className="text-gray-300">
          Test your skills with these coding challenges and earn XP
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search challenges..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex gap-2 flex-wrap justify-center md:justify-end">
            {['all', 'easy', 'medium', 'hard'].map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setDifficultyFilter(difficulty)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  difficultyFilter === difficulty
                    ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {difficulty === 'all' ? 'All' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap justify-center mt-4">
          {['all', ...categories].map((category) => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                categoryFilter === category
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-500 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Results Info */}
      <div className="mb-4 text-gray-400 text-sm">
        Showing {startIndex + 1}-{Math.min(endIndex, filteredChallenges.length)} of {filteredChallenges.length} challenges
        {searchQuery && ` (filtered from ${challenges.length} total)`}
      </div>

      {/* Challenge Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
    <thead>
      <tr className="border-b border-gray-700">
        <th className="text-left py-3 px-4 text-gray-300 font-medium">Challenge</th>
        <th className="text-left py-3 px-4 text-gray-300 font-medium">Category</th>
        <th className="text-left py-3 px-4 text-gray-300 font-medium">Difficulty</th>
        <th className="text-left py-3 px-4 text-gray-300 font-medium">Time Limit</th>
        <th className="text-left py-3 px-4 text-gray-300 font-medium">Reward</th>
        <th className="text-right py-3 px-4 text-gray-300 font-medium">Action</th>
      </tr>
    </thead>
    <tbody>
      {loading ? (
        // Loading skeleton
        Array.from({ length: 6 }).map((_, index) => (
          <motion.tr
            key={index}
            className="border-b border-gray-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <td className="py-4 px-4">
              <div className="h-6 bg-gray-600 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-600 rounded w-1/2"></div>
            </td>
            <td className="py-4 px-4">
              <div className="h-6 w-6 bg-gray-600 rounded-full"></div>
            </td>
            <td className="py-4 px-4">
              <div className="h-6 w-16 bg-gray-600 rounded-full"></div>
            </td>
            <td className="py-4 px-4">
              <div className="h-6 w-12 bg-gray-600 rounded-full"></div>
            </td>
            <td className="py-4 px-4">
              <div className="h-6 w-12 bg-gray-600 rounded-full"></div>
            </td>
            <td className="py-4 px-4 text-right">
              <div className="h-10 w-24 bg-gray-600 rounded-xl ml-auto"></div>
            </td>
          </motion.tr>
        ))
      ) : paginatedChallenges.length > 0 ? (
        paginatedChallenges.map((challenge, index) => {
          const CategoryIcon = getCategoryIcon(challenge.category);
          return (
            <motion.tr
              key={challenge.id}
              className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <td className="py-4 px-4">
                <div>
                  <h3 className="text-white font-medium">{challenge.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-1">{challenge.description}</p>
                </div>
              </td>
              
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <CategoryIcon className="h-5 w-5 text-neon-blue" />
                  <span className="text-gray-300 capitalize">{challenge.category}</span>
                </div>
              </td>
              
              <td className="py-4 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(challenge.difficulty)} bg-current bg-opacity-20`}>
                  {challenge.difficulty.toUpperCase()}
                </span>
              </td>
              
              <td className="py-4 px-4">
                <div className="flex items-center gap-1 text-gray-300">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(challenge.timeLimit)}</span>
                </div>
              </td>
              
              <td className="py-4 px-4">
                <div className="flex items-center gap-1 text-gray-300">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span>{challenge.xpReward} XP</span>
                </div>
              </td>
              
              <td className="py-4 px-4 text-right">
                <button
                  onClick={() => handleStartChallenge(challenge)}
                  className="px-4 py-2 bg-gradient-to-r from-neon-purple to-neon-blue text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-neon-purple/30 transition-all"
                >
                  Start
                </button>
              </td>
            </motion.tr>
          );
        })
      ) : (
        // No challenges found
        <motion.tr
          className="border-b border-gray-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <td colSpan={6} className="py-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Challenges Available</h3>
            <p className="text-gray-500">
              Check back later or contact an administrator to add practice challenges.
            </p>
          </td>
        </motion.tr>
      )}
    </tbody>
  </table>
      </div>

  {/* Pagination Controls */}
  {filteredChallenges.length > challengesPerPage && (
    <div className="mt-8 flex items-center justify-between">
      <div className="text-sm text-gray-400">
        Page {currentPage} of {totalPages}
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            currentPage === 1
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Previous
        </button>
        
        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                  currentPage === pageNum
                    ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            currentPage === totalPages
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  )}
      </div>
    </div>
  );
}
