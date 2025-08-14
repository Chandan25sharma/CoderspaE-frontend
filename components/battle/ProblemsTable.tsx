'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { 
  Brain, 
  Clock, 
  Star, 
  Plus,
  ThumbsUp,
  ThumbsDown,
  User,
  X,
  Send,
  RefreshCw,
  Trophy
} from 'lucide-react';

interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string[];
  timeLimit: number;
  rating: number;
  totalSolvers: number;
  tags: string[];
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  hints: string[];
  createdBy: string;
  votes: number;
  status: string;
}

interface ProblemSuggestion {
  _id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string[];
  suggestedBy: {
    username: string;
    name: string;
  };
  votes: Array<{
    user: string;
    vote: 'up' | 'down';
  }>;
  totalVotes: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface ProblemsTableProps {
  battleMode: string;
}

const ProblemsTable: React.FC<ProblemsTableProps> = ({ battleMode }) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [suggestions, setSuggestions] = useState<ProblemSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [showSuggestionBox, setShowSuggestionBox] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [newSuggestion, setNewSuggestion] = useState({ 
    title: '', 
    description: '', 
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    category: [battleMode.toLowerCase().replace(/\s+/g, '-')]
  });
  const [refreshing, setRefreshing] = useState(false);

  // Battle mode categories mapping
  const battleModeCategories: { [key: string]: string[] } = {
    'Quick Dual': ['quick-dual', 'speed-coding', 'algorithms'],
    'Minimalist Mind': ['minimalist-mind', 'clean-code', 'fundamentals'],
    'Mirror Arena': ['mirror-arena', 'real-time', 'competitive'],
    'Narrative Mode': ['narrative-mode', 'story-based', 'interactive'],
    'Live Viewer': ['live-viewer', 'spectator', 'analysis']
  };

  const categories = ['All', ...battleModeCategories[battleMode] || ['general']];

  const fetchProblems = useCallback(async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);

      const categoryFilter = selectedCategory === 'All' ? '' : `&category=${selectedCategory}`;
      const response = await fetch(`/api/problems?limit=20${categoryFilter}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch problems');
      }

      const result = await response.json();
      
      if (result.success) {
        setProblems(result.problems || []);
        setError(null);
      } else {
        throw new Error(result.error || 'Failed to fetch problems');
      }
    } catch (err) {
      console.error('Error fetching problems:', err);
      setError(err instanceof Error ? err.message : 'Failed to load problems');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory]);

  const fetchSuggestions = useCallback(async () => {
    try {
      const response = await fetch('/api/problems/suggestions');
      
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const result = await response.json();
      
      if (result.success) {
        setSuggestions(result.data.suggestions);
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    }
  }, []);

  useEffect(() => {
    fetchProblems();
    fetchSuggestions();
  }, [fetchProblems, fetchSuggestions]);

  const handleRefresh = () => {
    fetchProblems(true);
    fetchSuggestions();
  };

  const handleSuggestionSubmit = async () => {
    if (!newSuggestion.title.trim() || !newSuggestion.description.trim()) {
      return;
    }

    try {
      const response = await fetch('/api/problems/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSuggestion),
      });

      if (!response.ok) {
        throw new Error('Failed to submit suggestion');
      }

      const result = await response.json();
      
      if (result.success) {
        setNewSuggestion({ 
          title: '', 
          description: '', 
          difficulty: 'Medium',
          category: [battleMode.toLowerCase().replace(/\s+/g, '-')]
        });
        setShowSuggestionBox(false);
        fetchSuggestions(); // Refresh suggestions
      }
    } catch (err) {
      console.error('Error submitting suggestion:', err);
    }
  };

  const handleVote = async (suggestionId: string, voteType: 'up' | 'down') => {
    try {
      const response = await fetch(`/api/problems/suggestions/${suggestionId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vote: voteType }),
      });

      if (!response.ok) {
        throw new Error('Failed to vote');
      }

      const result = await response.json();
      
      if (result.success) {
        fetchSuggestions(); // Refresh to get updated votes
        if (result.data.approved) {
          fetchProblems(); // If suggestion was auto-approved, refresh problems too
        }
      }
    } catch (err) {
      console.error('Error voting:', err);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
        <div className="text-center text-red-400">
          <p className="text-lg font-semibold mb-2">Error Loading Problems</p>
          <p className="text-sm mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Problems List - 2/3 width */}
      <div className="lg:col-span-2">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">Problems</h2>
              <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-sm rounded-full font-medium">
                {problems.length} available
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-gray-300 text-sm transition-colors disabled:opacity-50"
              >
                {refreshing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh
              </button>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Problems Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Problem</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Difficulty</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Time</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Rating</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Solvers</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((problem, index) => (
                  <motion.tr
                    key={problem._id}
                    className="border-b border-gray-700/50 hover:bg-gray-700/30 cursor-pointer transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedProblem(problem)}
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-white font-medium">{problem.title}</p>
                        <p className="text-gray-400 text-sm truncate max-w-xs">
                          {problem.description}
                        </p>
                        <div className="flex gap-1 mt-1">
                          {problem.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-blue-400">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{problem.timeLimit}m</span>
                      </div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="text-white text-sm">{problem.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-green-400" />
                        <span className="text-white text-sm">{problem.totalSolvers}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Suggestions Panel - 1/3 width */}
      <div className="space-y-6">
        {/* Community Suggestions */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Community Suggestions</h3>
            </div>
            <button
              onClick={() => setShowSuggestionBox(!showSuggestionBox)}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-400 text-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              Suggest
            </button>
          </div>

          {/* Suggestion Form */}
          {showSuggestionBox && (
            <motion.div
              className="mb-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Problem title..."
                  value={newSuggestion.title}
                  onChange={(e) => setNewSuggestion({ ...newSuggestion, title: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                />
                <textarea
                  placeholder="Problem description..."
                  value={newSuggestion.description}
                  onChange={(e) => setNewSuggestion({ ...newSuggestion, description: e.target.value })}
                  rows={3}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 resize-none"
                />
                <select
                  value={newSuggestion.difficulty}
                  onChange={(e) => setNewSuggestion({ ...newSuggestion, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={handleSuggestionSubmit}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm transition-colors"
                  >
                    <Send className="h-4 w-4" />
                    Submit
                  </button>
                  <button
                    onClick={() => setShowSuggestionBox(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white text-sm transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Suggestions List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <motion.div
                key={suggestion._id}
                className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-white font-medium text-sm">{suggestion.title}</h4>
                  <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(suggestion.difficulty)}`}>
                    {suggestion.difficulty}
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {suggestion.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    by {suggestion.suggestedBy.username}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVote(suggestion._id, 'up')}
                      className="flex items-center gap-1 px-2 py-1 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded text-xs transition-colors"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      {suggestion.votes.filter(v => v.vote === 'up').length}
                    </button>
                    <button
                      onClick={() => handleVote(suggestion._id, 'down')}
                      className="flex items-center gap-1 px-2 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded text-xs transition-colors"
                    >
                      <ThumbsDown className="h-3 w-3" />
                      {suggestion.votes.filter(v => v.vote === 'down').length}
                    </button>
                  </div>
                </div>
                
                {suggestion.totalVotes >= 40 && (
                  <div className="mt-2 text-xs text-yellow-400">
                    🔥 {50 - suggestion.totalVotes} more votes needed for auto-approval!
                  </div>
                )}
              </motion.div>
            ))}
            
            {suggestions.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No suggestions yet</p>
                <p className="text-sm">Be the first to suggest a problem!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Problem Detail Modal */}
      {selectedProblem && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedProblem(null)}
        >
          <motion.div
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{selectedProblem.title}</h3>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded ${getDifficultyColor(selectedProblem.difficulty)}`}>
                    {selectedProblem.difficulty}
                  </span>
                  <div className="flex items-center gap-1 text-blue-400">
                    <Clock className="h-4 w-4" />
                    <span>{selectedProblem.timeLimit} minutes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-white">{selectedProblem.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedProblem(null)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Description</h4>
                <p className="text-gray-300 leading-relaxed">{selectedProblem.description}</p>
              </div>

              {selectedProblem.examples.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Examples</h4>
                  <div className="space-y-4">
                    {selectedProblem.examples.map((example, index) => (
                      <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-400 text-sm mb-1">Input:</p>
                            <pre className="bg-gray-700 p-2 rounded text-green-400 text-sm">{example.input}</pre>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm mb-1">Output:</p>
                            <pre className="bg-gray-700 p-2 rounded text-blue-400 text-sm">{example.output}</pre>
                          </div>
                        </div>
                        {example.explanation && (
                          <div className="mt-3">
                            <p className="text-gray-400 text-sm mb-1">Explanation:</p>
                            <p className="text-gray-300 text-sm">{example.explanation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedProblem.constraints.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Constraints</h4>
                  <ul className="space-y-1">
                    {selectedProblem.constraints.map((constraint, index) => (
                      <li key={index} className="text-gray-300 text-sm">• {constraint}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedProblem(null)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Start Solving
                </button>
                <button
                  onClick={() => setSelectedProblem(null)}
                  className="px-6 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ProblemsTable;
