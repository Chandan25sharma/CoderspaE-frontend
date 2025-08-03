'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Target, TrendingUp, Code, Clock, Zap, Award, RotateCcw } from 'lucide-react';
import { CodeEditor } from '../../components/CodeEditor';
import MetricsChart from '../../components/MetricsChart';

interface MetricsData {
  codeLength: number;
  runtime: number;
  memoryUsage: number;
  complexity: number;
  efficiency: number;
  timestamp: string;
}

const mockChallenge = {
  title: "Optimize Binary Search",
  description: "Implement binary search with the most efficient code possible. Focus on minimizing code length while maintaining optimal time complexity.",
  difficulty: "Medium" as const,
  targetMetrics: {
    codeLength: 150,
    runtime: 1,
    memoryUsage: 2.5,
    complexity: 3,
    efficiency: 85,
  },
  examples: [
    {
      input: "arr = [1,3,5,7,9,11], target = 7",
      output: "3",
      explanation: "Target 7 is at index 3"
    }
  ]
};

const CognitiveChallengesPage = () => {
  const [code, setCode] = useState(`def binary_search(arr, target):
    # Your optimized solution here
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1`);

  const [currentMetrics, setCurrentMetrics] = useState<MetricsData>({
    codeLength: 285,
    runtime: 8,
    memoryUsage: 4.2,
    complexity: 4,
    efficiency: 72,
    timestamp: new Date().toISOString()
  });

  const [metricsHistory, setMetricsHistory] = useState<MetricsData[]>([
    { codeLength: 350, runtime: 15, memoryUsage: 6.1, complexity: 6, efficiency: 45, timestamp: '2025-01-01T10:00:00Z' },
    { codeLength: 320, runtime: 12, memoryUsage: 5.5, complexity: 5, efficiency: 58, timestamp: '2025-01-01T10:05:00Z' },
    { codeLength: 290, runtime: 10, memoryUsage: 4.8, complexity: 4, efficiency: 68, timestamp: '2025-01-01T10:10:00Z' },
    { codeLength: 285, runtime: 8, memoryUsage: 4.2, complexity: 4, efficiency: 72, timestamp: '2025-01-01T10:15:00Z' },
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [aiCoachSuggestion, setAiCoachSuggestion] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Array<{
    id: string;
    user: string;
    code: string;
    metrics: MetricsData;
    rank: number;
  }>>([
    {
      id: '1',
      user: 'CodeGuru',
      code: 'def bs(a,t):l,r=0,len(a)-1\nwhile l<=r:m=(l+r)//2;return m if a[m]==t else bs(a[:m],t) if a[m]>t else bs(a[m+1:],t)+m+1\nreturn -1',
      metrics: { codeLength: 128, runtime: 2, memoryUsage: 1.8, complexity: 2, efficiency: 95, timestamp: '2025-01-01T09:45:00Z' },
      rank: 1
    },
    {
      id: '2', 
      user: 'OptimizeKing',
      code: 'binary_search=lambda a,t,l=0,r=None:binary_search(a,t,l,(r or len(a)-1)//2) if a[(r or len(a)-1)//2]>t else binary_search(a,t,(r or len(a)-1)//2+1,r or len(a)-1) if a[(r or len(a)-1)//2]<t else (r or len(a)-1)//2',
      metrics: { codeLength: 145, runtime: 3, memoryUsage: 2.1, complexity: 3, efficiency: 88, timestamp: '2025-01-01T09:50:00Z' },
      rank: 2
    }
  ]);

  // Simulate AI coach suggestions
  useEffect(() => {
    if (currentMetrics.efficiency < 80) {
      const suggestions = [
        "Try using lambda functions to reduce code length",
        "Consider removing unnecessary variables",
        "Use short variable names (but keep readability)",
        "Combine operations on single lines where possible",
        "Remove redundant comments and whitespace"
      ];
      setAiCoachSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)]);
    } else {
      setAiCoachSuggestion(null);
    }
  }, [currentMetrics]);

  const analyzeCode = (codeText: string): MetricsData => {
    // Simple metrics calculation (in real app, this would be done by backend)
    const lines = codeText.split('\n').filter(line => line.trim() !== '');
    const codeLength = codeText.replace(/\s+/g, '').length;
    const complexity = Math.max(1, lines.filter(line => 
      line.includes('if') || line.includes('while') || line.includes('for')
    ).length);
    
    // Simulate runtime based on code patterns
    const hasRecursion = codeText.includes('binary_search(');
    const hasLambda = codeText.includes('lambda');
    const runtime = hasRecursion ? Math.random() * 5 + 2 : 
                   hasLambda ? Math.random() * 3 + 1 : 
                   Math.random() * 10 + 5;
    
    const memoryUsage = 1 + (complexity * 0.5) + (codeLength / 100);
    const efficiency = Math.max(0, Math.min(100, 
      100 - (codeLength / 10) - (runtime * 2) - (complexity * 3)
    ));

    return {
      codeLength,
      runtime: Math.round(runtime * 10) / 10,
      memoryUsage: Math.round(memoryUsage * 10) / 10,
      complexity,
      efficiency: Math.round(efficiency),
      timestamp: new Date().toISOString()
    };
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    
    // Simulate code execution delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newMetrics = analyzeCode(code);
    setCurrentMetrics(newMetrics);
    setMetricsHistory(prev => [...prev, newMetrics]);
    
    setIsRunning(false);
  };

  const handleSubmit = () => {
    const newSubmission = {
      id: Date.now().toString(),
      user: 'You',
      code: code,
      metrics: currentMetrics,
      rank: submissions.length + 1 // Simplified ranking
    };
    setSubmissions(prev => [newSubmission, ...prev]);
  };

  const loadSubmission = (submission: typeof submissions[0]) => {
    setCode(submission.code);
    setCurrentMetrics(submission.metrics);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#44FF88';
      case 'Medium': return '#FFD700'; 
      case 'Hard': return '#FF4444';
      default: return '#AA00FF';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Brain className="text-purple-400" size={32} />
              <div>
                <h1 className="text-3xl font-bold">🧠 Minimalist Mind Mode</h1>
                <p className="text-gray-400">Optimize your code for maximum efficiency</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowComparison(!showComparison)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  showComparison 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {showComparison ? 'Hide' : 'Show'} Comparison
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Challenge & Code Editor */}
          <div className="xl:col-span-2 space-y-6">
            {/* Challenge Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{mockChallenge.title}</h2>
                  <span 
                    className="px-2 py-1 rounded text-xs font-semibold"
                    style={{ 
                      backgroundColor: `${getDifficultyColor(mockChallenge.difficulty)}20`,
                      color: getDifficultyColor(mockChallenge.difficulty)
                    }}
                  >
                    {mockChallenge.difficulty}
                  </span>
                </div>
                <Target className="text-yellow-400" size={20} />
              </div>
              
              <p className="text-gray-300 mb-4">{mockChallenge.description}</p>
              
              <div className="bg-gray-900 border border-gray-600 rounded p-4">
                <h4 className="font-semibold mb-2">Example:</h4>
                <div className="font-mono text-sm">
                  <div className="text-green-400">Input: {mockChallenge.examples[0].input}</div>
                  <div className="text-blue-400">Output: {mockChallenge.examples[0].output}</div>
                  <div className="text-gray-400 mt-1">{mockChallenge.examples[0].explanation}</div>
                </div>
              </div>

              {/* Target Metrics */}
              <div className="mt-4">
                <h4 className="font-semibold mb-2 text-yellow-400">🎯 Target Metrics:</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                  <div className="bg-gray-900 p-2 rounded">
                    <div className="text-gray-400">Length</div>
                    <div className="font-bold">≤{mockChallenge.targetMetrics.codeLength}</div>
                  </div>
                  <div className="bg-gray-900 p-2 rounded">
                    <div className="text-gray-400">Runtime</div>
                    <div className="font-bold">≤{mockChallenge.targetMetrics.runtime}ms</div>
                  </div>
                  <div className="bg-gray-900 p-2 rounded">
                    <div className="text-gray-400">Memory</div>
                    <div className="font-bold">≤{mockChallenge.targetMetrics.memoryUsage}MB</div>
                  </div>
                  <div className="bg-gray-900 p-2 rounded">
                    <div className="text-gray-400">Complexity</div>
                    <div className="font-bold">≤{mockChallenge.targetMetrics.complexity}</div>
                  </div>
                  <div className="bg-gray-900 p-2 rounded">
                    <div className="text-gray-400">Efficiency</div>
                    <div className="font-bold">≥{mockChallenge.targetMetrics.efficiency}%</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Code Editor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <CodeEditor
                value={code}
                onChange={setCode}
                language="python"
                onRun={handleRunCode}
                isRunning={isRunning}
                height="400px"
              />
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                {isRunning ? <RotateCcw className="animate-spin" size={16} /> : <Zap size={16} />}
                {isRunning ? 'Analyzing...' : 'Run & Analyze'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Award size={16} />
                Submit Solution
              </motion.button>
            </motion.div>

            {/* AI Coach Suggestion */}
            <AnimatePresence>
              {aiCoachSuggestion && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="text-blue-400" size={20} />
                    <h4 className="font-semibold text-blue-400">AI Coach Suggestion</h4>
                  </div>
                  <p className="text-gray-300">{aiCoachSuggestion}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAiCoachSuggestion(null)}
                    className="mt-2 text-xs text-gray-400 hover:text-white"
                  >
                    Dismiss
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Metrics & Leaderboard */}
          <div className="space-y-6">
            {/* Metrics Chart */}
            <MetricsChart
              currentMetrics={currentMetrics}
              history={metricsHistory}
              targetMetrics={mockChallenge.targetMetrics}
              showComparison={showComparison}
            />

            {/* Top Submissions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="text-yellow-400" size={20} />
                Top Solutions
              </h3>
              
              <div className="space-y-3">
                {submissions.map((submission, index) => (
                  <motion.div
                    key={submission.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-900 border border-gray-600 rounded-lg p-3 cursor-pointer"
                    onClick={() => loadSubmission(submission)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">#{submission.rank}</span>
                        <span className="font-semibold">{submission.user}</span>
                      </div>
                      <span className="text-yellow-400 font-bold">
                        {submission.metrics.efficiency}%
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 text-xs text-gray-400">
                      <div>
                        <div>Length</div>
                        <div className="text-white font-mono">{submission.metrics.codeLength}</div>
                      </div>
                      <div>
                        <div>Runtime</div>
                        <div className="text-white font-mono">{submission.metrics.runtime}ms</div>
                      </div>
                      <div>
                        <div>Memory</div>
                        <div className="text-white font-mono">{submission.metrics.memoryUsage}MB</div>
                      </div>
                      <div>
                        <div>Complex</div>
                        <div className="text-white font-mono">{submission.metrics.complexity}</div>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500 font-mono bg-gray-800 p-2 rounded overflow-hidden">
                      {submission.code.substring(0, 60)}...
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CognitiveChallengesPage;
