'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle,
  Send,
  Trophy,
  CheckCircle,
  Code2,
  Play
} from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  isStaff?: boolean;
}

interface ProblemSuggestion {
  id: string;
  title: string;
  description: string;
  author: string;
  votes: number;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface ProblemDetailProps {
  problemId: string;
  onBack?: () => void;
}

const ProblemDetail: React.FC<ProblemDetailProps> = ({ problemId, onBack }) => {
  const [activeTab, setActiveTab] = useState<'problem' | 'comments' | 'suggestions'>('problem');
  const [newComment, setNewComment] = useState('');
  const [newSuggestion, setNewSuggestion] = useState({ title: '', description: '' });
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/challenges');
    }
  };

  // Mock data - replace with real data fetching
  const problem = {
    id: problemId,
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Algorithms',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    solvedCount: 2847,
    attemptCount: 4521,
    rating: 4.2,
    timeLimit: 30,
    tags: ['Array', 'Hash Table'],
    isUserSolved: false
  };

  const comments: Comment[] = [
    {
      id: '1',
      author: 'CodeMaster123',
      content: 'Great problem for beginners! The hash table approach is very elegant.',
      timestamp: '2 hours ago',
      upvotes: 15,
      downvotes: 1,
      isStaff: false
    },
    {
      id: '2',
      author: 'AdminUser',
      content: 'Remember to consider edge cases like duplicate values!',
      timestamp: '1 day ago',
      upvotes: 28,
      downvotes: 0,
      isStaff: true
    }
  ];

  const suggestions: ProblemSuggestion[] = [
    {
      id: '1',
      title: 'Three Sum Variant',
      description: 'Similar to Two Sum but find three numbers that add up to target',
      author: 'AlgoExpert',
      votes: 67,
      timestamp: '3 days ago',
      status: 'pending'
    },
    {
      id: '2',
      title: 'Two Sum with Sorted Array',
      description: 'Two Sum problem but the input array is already sorted',
      author: 'SortedFan',
      votes: 34,
      timestamp: '1 week ago',
      status: 'approved'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'Hard': return 'text-orange-400 bg-orange-500/20';
      case 'Expert': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-500/20';
      case 'rejected': return 'text-red-400 bg-red-500/20';
      default: return 'text-yellow-400 bg-yellow-500/20';
    }
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      // Add comment logic here
      setNewComment('');
    }
  };

  const handleSubmitSuggestion = () => {
    if (newSuggestion.title.trim() && newSuggestion.description.trim()) {
      // Add suggestion logic here
      setNewSuggestion({ title: '', description: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          className="flex items-center gap-4 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.button
            onClick={handleBack}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h1 className="text-3xl font-bold text-white">{problem.title}</h1>
          <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
          {problem.isUserSolved && (
            <CheckCircle className="w-6 h-6 text-green-400" />
          )}
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex gap-1 mb-6 bg-gray-800/50 rounded-xl p-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {[
            { id: 'problem', label: 'Problem', icon: Code2 },
            { id: 'comments', label: 'Comments', icon: MessageCircle },
            { id: 'suggestions', label: 'Suggestions', icon: ThumbsUp }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'problem' | 'comments' | 'suggestions')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'problem' && (
              <motion.div
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Problem Description */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Description</h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                      {problem.description}
                    </p>
                  </div>
                </div>

                {/* Examples */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-4">Examples</h3>
                  {problem.examples.map((example, index) => (
                    <div key={index} className="mb-4 p-4 bg-gray-700/50 rounded-lg">
                      <h4 className="font-semibold text-white mb-2">Example {index + 1}:</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-gray-400">Input: </span>
                          <span className="text-green-300 font-mono">{example.input}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Output: </span>
                          <span className="text-blue-300 font-mono">{example.output}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Explanation: </span>
                          <span className="text-gray-300">{example.explanation}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-4">Constraints</h3>
                  <ul className="space-y-2">
                    {problem.constraints.map((constraint, index) => (
                      <li key={index} className="text-gray-300 font-mono text-sm">
                        • {constraint}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <motion.button
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="w-5 h-5" />
                  {problem.isUserSolved ? 'View Solution' : 'Start Coding'}
                </motion.button>
              </motion.div>
            )}

            {activeTab === 'comments' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Add Comment */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-4">Add Comment</h3>
                  <div className="space-y-4">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts, hints, or ask questions..."
                      className="w-full h-32 p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                    />
                    <motion.button
                      onClick={handleSubmitComment}
                      className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Send className="w-4 h-4" />
                      Post Comment
                    </motion.button>
                  </div>
                </div>

                {/* Comments List */}
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {comment.author.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-white">{comment.author}</h4>
                            {comment.isStaff && (
                              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-md">
                                Staff
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">{comment.timestamp}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">{comment.content}</p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-gray-400 hover:text-green-400 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">{comment.upvotes}</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors">
                        <ThumbsDown className="w-4 h-4" />
                        <span className="text-sm">{comment.downvotes}</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'suggestions' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Add Suggestion */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-4">Suggest New Problem</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={newSuggestion.title}
                      onChange={(e) => setNewSuggestion(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Problem title..."
                      className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <textarea
                      value={newSuggestion.description}
                      onChange={(e) => setNewSuggestion(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the problem and its requirements..."
                      className="w-full h-32 p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                    />
                    <motion.button
                      onClick={handleSubmitSuggestion}
                      className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Send className="w-4 h-4" />
                      Submit Suggestion
                    </motion.button>
                  </div>
                </div>

                {/* Suggestions List */}
                {suggestions.map((suggestion) => (
                  <motion.div
                    key={suggestion.id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-xl font-bold text-white mb-2">{suggestion.title}</h4>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-gray-400">by {suggestion.author}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-400">{suggestion.timestamp}</span>
                          <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getStatusColor(suggestion.status)}`}>
                            {suggestion.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="w-5 h-5 text-blue-400" />
                        <span className="text-white font-bold">{suggestion.votes}</span>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">{suggestion.description}</p>
                    <motion.button
                      className="px-4 py-2 bg-blue-600/20 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Vote Up
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 sticky top-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">Problem Stats</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Category</span>
                  <span className="text-white">{problem.category}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Time Limit</span>
                  <div className="flex items-center gap-1 text-white">
                    <Clock className="w-4 h-4" />
                    {problem.timeLimit}m
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Solved</span>
                  <div className="flex items-center gap-1 text-green-400">
                    <Users className="w-4 h-4" />
                    {problem.solvedCount}/{problem.attemptCount}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Rating</span>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4" />
                    {problem.rating}
                  </div>
                </div>
              </div>

              <hr className="my-6 border-gray-700" />

              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {problem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <hr className="my-6 border-gray-700" />

              <div className="text-center">
                <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">
                  Complete this problem to earn <span className="text-yellow-400 font-semibold">50 XP</span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;
