'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Users, 
  Plus,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  AlertCircle,
  X,
  Send,
  Link,
  ArrowLeft
} from 'lucide-react';

interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  category: string[];
  tags: string[];
  timeLimit?: number;
  isActive: boolean;
  upvotes: number;
  downvotes: number;
  createdAt: string;
}

interface Suggestion {
  _id: string;
  title: string;
  description: string;
  suggestedBy: {
    name: string;
    _id: string;
  };
  upvotes: number;
  downvotes: number;
  createdAt: string;
}

const ChallengeProblemsPage: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [showSuggestionBox, setShowSuggestionBox] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengeProblem, setChallengeProblem] = useState<Problem | null>(null);
  const [challengeTarget, setChallengeTarget] = useState('');
  const [challengeMessage, setChallengeMessage] = useState('');
  const [newSuggestion, setNewSuggestion] = useState({ title: '', description: '' });

  const categories = [
    'All',
    'Minimalist Mind',
    'Mirror Arena', 
    'Narrative Mode',
    'Team Clash',
    'Attack & Defend'
  ];

  const fetchProblems = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('battleMode', selectedCategory);
      // Get all problems by setting a high limit
      params.append('limit', '1000');
      
      const response = await fetch(`/api/problems?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch problems');
      }
      
      const data = await response.json();
      if (data.success && data.problems) {
        setProblems(data.problems || []);
      } else {
        throw new Error(data.error || 'Failed to fetch problems');
      }
    } catch (err) {
      console.error('Error fetching problems:', err);
      // Show empty array on error instead of mock data
      setProblems([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch('/api/suggestions');
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      
      const data = await response.json();
      setSuggestions(data.data || []);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    }
  };

  const submitSuggestion = async () => {
    if (!newSuggestion.title.trim() || !newSuggestion.description.trim()) return;

    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSuggestion)
      });

      if (!response.ok) throw new Error('Failed to submit suggestion');
      
      const result = await response.json();
      if (result.success) {
        setNewSuggestion({ title: '', description: '' });
        setShowSuggestionBox(false);
        fetchSuggestions();
        // Show success message
        alert(result.message || 'Suggestion submitted successfully!');
      }
    } catch (err) {
      console.error('Error submitting suggestion:', err);
      alert('Failed to submit suggestion. Please try again.');
    }
  };

  const voteSuggestion = async (suggestionId: string, voteType: 'upvote' | 'downvote') => {
    try {
      const response = await fetch('/api/suggestions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          suggestionId, 
          action: voteType 
        })
      });

      if (!response.ok) throw new Error('Failed to vote');
      
      const result = await response.json();
      if (result.success) {
        fetchSuggestions();
      }
    } catch (err) {
      console.error('Error voting:', err);
    }
  };

  const sendChallenge = async () => {
    if (!challengeTarget.trim() || !challengeProblem) return;

    try {
      const response = await fetch('/api/challenges/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUser: challengeTarget,
          problemId: challengeProblem._id,
          message: challengeMessage || `I challenge you to solve: ${challengeProblem.title}!`
        })
      });

      if (!response.ok) throw new Error('Failed to send challenge');
      
      setChallengeTarget('');
      setChallengeMessage('');
      setShowChallengeModal(false);
      setChallengeProblem(null);
      
      // Show success message (you can replace with toast/notification)
      alert('Challenge sent successfully!');
    } catch (err) {
      console.error('Error sending challenge:', err);
      alert('Failed to send challenge. Please try again.');
    }
  };

  useEffect(() => {
    fetchProblems();
    fetchSuggestions();
  }, [fetchProblems]);

  // Reset to page 1 when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'Hard': return 'text-orange-400 bg-orange-500/20';
      case 'Expert': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const filteredProblems = problems.filter(problem => {
    const categoryMatch = selectedCategory === 'All' || (problem.category || []).includes(selectedCategory);
    const searchMatch = searchQuery === '' || 
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (problem.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return categoryMatch && searchMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProblems = filteredProblems.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-black">
       <div className="container mx-auto px-4 py-2">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white ">
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
            <span className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 bg-clip-text text-transparent">
              Challenge Problems
            </span>
          </h1>
          <p className="text-gray-300">
            Choose from different battle categories and solve coding challenges
          </p>
        </motion.div>
       

        {/* Category Filter */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-900 text-white shadow-lg'
                    : 'bg-slate-900 text-gray-300 hover:bg-slate-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Problems Table (2/3 width) */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl "
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="p-6 border-b border-blue-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">Available Problems</h2>
                    <p className="text-gray-400">Click on any problem to view details</p>
                  </div>
                  <div className="text-sm text-gray-400">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredProblems.length)} of {filteredProblems.length} problems
                  </div>
                </div>
                
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search problems by title, description, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
                  <p className="text-gray-400">Loading problems...</p>
                </div>
              ) : (
                <div className="overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left p-4 text-gray-300 font-medium">Problem</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Difficulty</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Time</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Categories</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedProblems.map((problem) => (
                        <tr
                          key={problem._id}
                          className="border-b  hover:bg-slate-700/30 transition-colors"
                        >
                          <td className="p-4">
                            <div>
                              <h3 
                                onClick={() => setSelectedProblem(problem)}
                                className="text-white font-medium hover:text-blue-900 transition-colors cursor-pointer"
                              >
                                {problem.title}
                              </h3>
                              <p className="text-gray-400 text-sm line-clamp-1">
                                {problem.description}
                              </p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                              {problem.difficulty}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1 text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>{problem.timeLimit || 30}m</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex flex-wrap gap-1">
                                {(problem.category || []).slice(0, 2).map((cat) => (
                                  <span key={cat} className="px-2 py-1 bg-slate-700/50 text-gray-300 text-xs rounded">
                                    {cat}
                                  </span>
                                ))}
                                {(problem.category || []).length > 2 && (
                                  <span className="px-2 py-1 bg-slate-700/50 text-gray-400 text-xs rounded">
                                    +{(problem.category || []).length - 2}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setChallengeProblem(problem);
                                  setShowChallengeModal(true);
                                }}
                                className="px-3 py-1 bg-blue-950 hover:bg-blue-900 text-white text-xs rounded-lg transition-colors"
                              >
                                Challenge
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Pagination Controls */}
                  {filteredProblems.length > itemsPerPage && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700">
                      <div className="text-sm text-gray-400">
                        Page {currentPage} of {totalPages}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={goToPreviousPage}
                          disabled={currentPage === 1}
                          className="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-gray-500 text-white rounded transition-colors"
                        >
                          Previous
                        </button>
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                          const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                          if (pageNum <= totalPages) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => goToPage(pageNum)}
                                className={`px-3 py-1 text-sm rounded transition-colors ${
                                  pageNum === currentPage
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                          return null;
                        })}
                        <button
                          onClick={goToNextPage}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-gray-500 text-white rounded transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {filteredProblems.length === 0 && (
                    <div className="p-8 text-center">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">No Problems Found</h3>
                      <p className="text-gray-400">No problems available for the selected category.</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Suggestions (1/3 width) */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-gray900 backdrop-blur-sm rounded-2xl  "
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="p-6 border-b border-purple-500/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Community Suggestions</h2>
                  <button
                    onClick={() => setShowSuggestionBox(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-950 hover:bg-blue-900 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Suggest
                  </button>
                </div>
                <p className="text-gray-400 text-sm mt-1">Suggest new problems for the community</p>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <div key={suggestion._id} className="p-4 border-b border-slate-700/50">
                    <h3 className="text-white font-medium mb-2">{suggestion.title}</h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-3">{suggestion.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        by {suggestion.suggestedBy.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => voteSuggestion(suggestion._id, 'upvote')}
                          className="flex items-center gap-1 px-2 py-1 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded transition-colors"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span className="text-xs">{suggestion.upvotes}</span>
                        </button>
                        <button
                          onClick={() => voteSuggestion(suggestion._id, 'downvote')}
                          className="flex items-center gap-1 px-2 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded transition-colors"
                        >
                          <ThumbsDown className="w-3 h-3" />
                          <span className="text-xs">{suggestion.downvotes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {suggestions.length === 0 && (
                  <div className="p-8 text-center">
                    <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No suggestions yet</p>
                    <p className="text-gray-500 text-xs">Be the first to suggest a problem!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Problem Detail Modal */}
        {selectedProblem && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedProblem(null)}
          >
            <motion.div
              className="bg-slate-800 rounded-2xl  max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-purple-500/20">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedProblem.title}</h2>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(selectedProblem.difficulty)}`}>
                        {selectedProblem.difficulty}
                      </span>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{selectedProblem.timeLimit || 30} minutes</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProblem(null)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Problem Description</h3>
                <p className="text-gray-300 whitespace-pre-wrap">{selectedProblem.description}</p>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProblem.category.map((cat) => (
                      <span key={cat} className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-lg">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProblem.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-slate-700/50 text-gray-300 text-sm rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Challenge Modal */}
        {showChallengeModal && challengeProblem && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowChallengeModal(false)}
          >
            <motion.div
              className="bg-slate-800 rounded-2xl border border-purple-500/20 max-w-2xl w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-purple-500/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Send Challenge</h2>
                  <button
                    onClick={() => setShowChallengeModal(false)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4 p-3 bg-slate-700/30 rounded-lg">
                  <h3 className="text-white font-medium">{challengeProblem.title}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-1 ${getDifficultyColor(challengeProblem.difficulty)}`}>
                    {challengeProblem.difficulty}
                  </span>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-medium mb-2">Challenge User (Username or Email)</label>
                  <input
                    type="text"
                    value={challengeTarget}
                    onChange={(e) => setChallengeTarget(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter username or email..."
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-300 text-sm font-medium mb-2">Custom Message (Optional)</label>
                  <textarea
                    value={challengeMessage}
                    onChange={(e) => setChallengeMessage(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Add a personal message..."
                  />
                </div>
                
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowChallengeModal(false)}
                    className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendChallenge}
                    disabled={!challengeTarget.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Send Challenge
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Suggestion Modal */}
        {showSuggestionBox && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowSuggestionBox(false)}
          >
            <motion.div
              className="bg-slate-800 rounded-2xl border border-purple-500/20 max-w-2xl w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-purple-500/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Suggest a Problem</h2>
                  <button
                    onClick={() => setShowSuggestionBox(false)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-medium mb-2">Problem Title</label>
                  <input
                    type="text"
                    value={newSuggestion.title}
                    onChange={(e) => setNewSuggestion(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter problem title..."
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-300 text-sm font-medium mb-2">Problem Description</label>
                  <textarea
                    value={newSuggestion.description}
                    onChange={(e) => setNewSuggestion(prev => ({ ...prev, description: e.target.value }))}
                    rows={6}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Describe the problem in detail..."
                  />
                </div>
                
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowSuggestionBox(false)}
                    className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitSuggestion}
                    disabled={!newSuggestion.title.trim() || !newSuggestion.description.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Submit Suggestion
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChallengeProblemsPage;
