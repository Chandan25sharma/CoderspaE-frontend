'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, Code, Timer, Star, Brain } from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  description: string;
  timeLimit: number;
  rating: number;
}

interface ProblemSelectorProps {
  onStartBattle: (problem: Problem) => void;
}

const ProblemSelector: React.FC<ProblemSelectorProps> = ({ onStartBattle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const problems: Problem[] = [
    {
      id: '1',
      title: 'Two Sum',
      difficulty: 'Easy',
      tags: ['Array', 'Hash Table'],
      description: 'Find two numbers that add up to a target sum',
      timeLimit: 15,
      rating: 4.2
    },
    {
      id: '2',
      title: 'Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      tags: ['String', 'Sliding Window'],
      description: 'Find the length of the longest substring without repeating characters',
      timeLimit: 25,
      rating: 4.1
    },
    {
      id: '3',
      title: 'Median of Two Sorted Arrays',
      difficulty: 'Hard',
      tags: ['Array', 'Binary Search'],
      description: 'Find the median of two sorted arrays in O(log(min(m,n))) time',
      timeLimit: 35,
      rating: 4.5
    },
    {
      id: '4',
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      tags: ['String', 'Stack'],
      description: 'Determine if parentheses string is valid',
      timeLimit: 12,
      rating: 4.3
    },
    {
      id: '5',
      title: 'Binary Tree Inorder Traversal',
      difficulty: 'Medium',
      tags: ['Tree', 'Stack', 'Recursion'],
      description: 'Return inorder traversal of binary tree values',
      timeLimit: 20,
      rating: 4.0
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const handleProblemSelect = (problem: Problem) => {
    setSelectedProblem(problem);
    setIsOpen(false);
  };

  return (
    <motion.div
      className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white">Challenge Action</h2>
      </div>

      {/* Problem Selector Dropdown */}
      <div className="relative mb-6">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-gray-700/50 rounded-xl border border-white/10 hover:border-white/20 transition-colors"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center gap-3">
            <Code className="w-5 h-5 text-blue-400" />
            <div className="text-left">
              <p className="text-white font-medium">
                {selectedProblem ? selectedProblem.title : 'Select a Problem'}
              </p>
              {selectedProblem && (
                <p className="text-gray-400 text-sm">{selectedProblem.description}</p>
              )}
            </div>
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </motion.button>

        {/* Dropdown Menu */}
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl z-10 max-h-80 overflow-y-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {problems.map((problem, index) => (
              <motion.div
                key={problem.id}
                className="p-4 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-b-0"
                onClick={() => handleProblemSelect(problem)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium">{problem.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs">{problem.rating}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-2">{problem.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {problem.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Timer className="w-3 h-3" />
                    {problem.timeLimit}m
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Start Battle Button */}
      <motion.button
        onClick={() => selectedProblem && onStartBattle(selectedProblem)}
        disabled={!selectedProblem}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
          selectedProblem
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
        whileHover={selectedProblem ? { scale: 1.02, y: -2 } : {}}
        whileTap={selectedProblem ? { scale: 0.98 } : {}}
      >
        {selectedProblem ? 'Start Quick Dual Battle!' : 'Select a Problem First'}
      </motion.button>

      {selectedProblem && (
        <motion.div
          className="mt-4 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-400">Selected Problem:</span>
            <span className="text-white font-medium">{selectedProblem.title}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-blue-400">Time Limit:</span>
            <span className="text-white">{selectedProblem.timeLimit} minutes</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-blue-400">Difficulty:</span>
            <span className={`font-medium ${getDifficultyColor(selectedProblem.difficulty).split(' ')[0]}`}>
              {selectedProblem.difficulty}
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProblemSelector;
