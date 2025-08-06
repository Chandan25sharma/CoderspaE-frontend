'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Puzzle,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Star,
  Clock,
  Code,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  Award
} from 'lucide-react';

interface Challenge {
  _id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'algorithms' | 'data-structures' | 'dynamic-programming' | 'graphs' | 'strings' | 'math';
  languages: string[];
  status: 'draft' | 'published' | 'archived' | 'under-review';
  creator: {
    _id: string;
    name: string;
    type: 'admin' | 'community';
  };
  createdAt: string;
  updatedAt: string;
  stats: {
    attempts: number;
    completions: number;
    successRate: number;
    averageTime: number; // in minutes
    likes: number;
    dislikes: number;
    rating: number;
  };
  tags: string[];
  testCases: number;
  solution?: {
    exists: boolean;
    language: string;
  };
  reports: number;
  featured: boolean;
}

const ChallengeManagement = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);

  // Mock data - in production, fetch from API
  useEffect(() => {
    const mockChallenges: Challenge[] = [
      {
        _id: '1',
        title: 'Two Sum Problem',
        description: 'Given an array of integers and a target sum, return indices of two numbers that add up to the target.',
        difficulty: 'easy',
        category: 'algorithms',
        languages: ['JavaScript', 'Python', 'Java', 'C++'],
        status: 'published',
        creator: {
          _id: 'admin1',
          name: 'Admin Team',
          type: 'admin'
        },
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-16T14:30:00Z',
        stats: {
          attempts: 1250,
          completions: 987,
          successRate: 78.96,
          averageTime: 15.5,
          likes: 234,
          dislikes: 12,
          rating: 4.2
        },
        tags: ['arrays', 'hash-table', 'beginner'],
        testCases: 8,
        solution: {
          exists: true,
          language: 'JavaScript'
        },
        reports: 0,
        featured: true
      },
      {
        _id: '2',
        title: 'Binary Tree Maximum Path Sum',
        description: 'Find the maximum path sum in a binary tree where the path can start and end at any nodes.',
        difficulty: 'hard',
        category: 'data-structures',
        languages: ['Python', 'Java', 'C++'],
        status: 'published',
        creator: {
          _id: 'user123',
          name: 'Sarah Wilson',
          type: 'community'
        },
        createdAt: '2024-01-12T08:20:00Z',
        updatedAt: '2024-01-18T16:45:00Z',
        stats: {
          attempts: 456,
          completions: 134,
          successRate: 29.38,
          averageTime: 45.2,
          likes: 89,
          dislikes: 23,
          rating: 3.8
        },
        tags: ['binary-tree', 'recursion', 'hard'],
        testCases: 12,
        solution: {
          exists: true,
          language: 'Python'
        },
        reports: 0,
        featured: false
      },
      {
        _id: '3',
        title: 'Dynamic Fibonacci Sequence',
        description: 'Implement an efficient solution to calculate the nth Fibonacci number using dynamic programming.',
        difficulty: 'medium',
        category: 'dynamic-programming',
        languages: ['JavaScript', 'Python', 'Java'],
        status: 'under-review',
        creator: {
          _id: 'user456',
          name: 'Mike Chen',
          type: 'community'
        },
        createdAt: '2024-01-18T12:15:00Z',
        updatedAt: '2024-01-19T09:30:00Z',
        stats: {
          attempts: 89,
          completions: 67,
          successRate: 75.28,
          averageTime: 22.1,
          likes: 34,
          dislikes: 5,
          rating: 4.1
        },
        tags: ['fibonacci', 'dynamic-programming', 'optimization'],
        testCases: 10,
        solution: {
          exists: false,
          language: ''
        },
        reports: 0,
        featured: false
      },
      {
        _id: '4',
        title: 'Reported Challenge - Unclear Instructions',
        description: 'This challenge has been reported for having unclear or confusing instructions.',
        difficulty: 'medium',
        category: 'algorithms',
        languages: ['JavaScript'],
        status: 'published',
        creator: {
          _id: 'user789',
          name: 'Unknown User',
          type: 'community'
        },
        createdAt: '2024-01-10T15:45:00Z',
        updatedAt: '2024-01-17T11:20:00Z',
        stats: {
          attempts: 234,
          completions: 45,
          successRate: 19.23,
          averageTime: 35.7,
          likes: 12,
          dislikes: 67,
          rating: 2.1
        },
        tags: ['algorithms', 'confusing'],
        testCases: 6,
        solution: {
          exists: false,
          language: ''
        },
        reports: 8,
        featured: false
      }
    ];

    setTimeout(() => {
      setChallenges(mockChallenges);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty;
    const matchesStatus = selectedStatus === 'all' || challenge.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || challenge.category === selectedCategory;
    
    return matchesSearch && matchesDifficulty && matchesStatus && matchesCategory;
  });

  const handleChallengeAction = (action: string, challengeId: string) => {
    setChallenges(prevChallenges => 
      prevChallenges.map(challenge => {
        if (challenge._id === challengeId) {
          switch (action) {
            case 'publish':
              return { ...challenge, status: 'published' as const };
            case 'archive':
              return { ...challenge, status: 'archived' as const };
            case 'feature':
              return { ...challenge, featured: !challenge.featured };
            case 'approve':
              return { ...challenge, status: 'published' as const };
            case 'reject':
              return { ...challenge, status: 'draft' as const };
            default:
              return challenge;
          }
        }
        return challenge;
      })
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400 bg-green-400/10';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'hard':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'text-green-400 bg-green-400/10';
      case 'draft':
        return 'text-gray-400 bg-gray-400/10';
      case 'archived':
        return 'text-red-400 bg-red-400/10';
      case 'under-review':
        return 'text-yellow-400 bg-yellow-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'draft':
        return <Edit3 className="h-4 w-4 text-gray-400" />;
      case 'archived':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'under-review':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <AdminLayout activeSection="challenges">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Challenge Management</h1>
            <p className="text-gray-400 mt-1">Create and manage coding challenges</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              New Challenge
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
              Import Challenges
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search challenges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="algorithms">Algorithms</option>
              <option value="data-structures">Data Structures</option>
              <option value="dynamic-programming">Dynamic Programming</option>
              <option value="graphs">Graphs</option>
              <option value="strings">Strings</option>
              <option value="math">Math</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="under-review">Under Review</option>
              <option value="archived">Archived</option>
            </select>

            {/* Advanced Filters */}
            <button className="flex items-center justify-center px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors">
              <Filter className="h-5 w-5 mr-2" />
              More Filters
            </button>
          </div>
        </div>

        {/* Challenge Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Challenges</p>
                <p className="text-2xl font-bold text-white">{challenges.length}</p>
              </div>
              <Puzzle className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Published</p>
                <p className="text-2xl font-bold text-green-400">
                  {challenges.filter(c => c.status === 'published').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Under Review</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {challenges.filter(c => c.status === 'under-review').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Featured</p>
                <p className="text-2xl font-bold text-purple-400">
                  {challenges.filter(c => c.featured).length}
                </p>
              </div>
              <Star className="h-8 w-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Reported</p>
                <p className="text-2xl font-bold text-red-400">
                  {challenges.filter(c => c.reports > 0).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Challenges Table */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Challenge
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Difficulty & Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Creator & Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                      Loading challenges...
                    </td>
                  </tr>
                ) : filteredChallenges.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                      No challenges found
                    </td>
                  </tr>
                ) : (
                  filteredChallenges.map((challenge) => (
                    <motion.tr
                      key={challenge._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center">
                            <div className="text-white font-medium">{challenge.title}</div>
                            {challenge.featured && (
                              <Star className="h-4 w-4 text-yellow-400 ml-2 fill-current" />
                            )}
                          </div>
                          <div className="text-gray-400 text-sm mt-1 max-w-xs truncate">
                            {challenge.description}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {challenge.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                            {challenge.tags.length > 3 && (
                              <span className="text-gray-500 text-xs">+{challenge.tags.length - 3}</span>
                            )}
                          </div>
                          {challenge.reports > 0 && (
                            <div className="flex items-center text-red-400 text-xs mt-1">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {challenge.reports} report{challenge.reports > 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </span>
                          <div className="text-gray-300 text-sm capitalize">
                            {challenge.category.replace('-', ' ')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {getStatusIcon(challenge.status)}
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(challenge.status)}`}>
                            {challenge.status.replace('-', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm space-y-1">
                          <div className="flex items-center text-white">
                            <Users className="h-3 w-3 mr-1" />
                            {challenge.stats.attempts} attempts
                          </div>
                          <div className="flex items-center text-green-400">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {challenge.stats.successRate.toFixed(1)}% success
                          </div>
                          <div className="flex items-center text-blue-400">
                            <Star className="h-3 w-3 mr-1" />
                            {challenge.stats.rating.toFixed(1)} rating
                          </div>
                          <div className="flex items-center space-x-2 text-xs">
                            <div className="flex items-center text-green-400">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {challenge.stats.likes}
                            </div>
                            <div className="flex items-center text-red-400">
                              <ThumbsDown className="h-3 w-3 mr-1" />
                              {challenge.stats.dislikes}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-white">{challenge.creator.name}</div>
                          <div className={`text-xs ${challenge.creator.type === 'admin' ? 'text-yellow-400' : 'text-gray-400'}`}>
                            {challenge.creator.type}
                          </div>
                          <div className="text-gray-500 text-xs mt-1">
                            {formatDate(challenge.createdAt)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedChallenge(challenge);
                              setShowChallengeModal(true);
                            }}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                            title="Edit Challenge"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleChallengeAction('feature', challenge._id)}
                            className={`p-1 transition-colors ${
                              challenge.featured 
                                ? 'text-yellow-400 hover:text-yellow-300' 
                                : 'text-gray-400 hover:text-yellow-400'
                            }`}
                            title={challenge.featured ? 'Remove from Featured' : 'Add to Featured'}
                          >
                            <Star className={challenge.featured ? 'h-4 w-4 fill-current' : 'h-4 w-4'} />
                          </button>
                          {challenge.status === 'under-review' && (
                            <>
                              <button
                                onClick={() => handleChallengeAction('approve', challenge._id)}
                                className="p-1 text-gray-400 hover:text-green-400 transition-colors"
                                title="Approve Challenge"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleChallengeAction('reject', challenge._id)}
                                className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                                title="Reject Challenge"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button
                            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                            title="Delete Challenge"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-gray-400 text-sm">
            Showing {filteredChallenges.length} of {challenges.length} challenges
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-gray-700 text-white rounded border border-gray-600 hover:bg-gray-600 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded">
              1
            </button>
            <button className="px-3 py-1 bg-gray-700 text-white rounded border border-gray-600 hover:bg-gray-600 transition-colors">
              2
            </button>
            <button className="px-3 py-1 bg-gray-700 text-white rounded border border-gray-600 hover:bg-gray-600 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Challenge Detail Modal */}
      {showChallengeModal && selectedChallenge && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Challenge Details</h2>
              <button
                onClick={() => setShowChallengeModal(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Challenge Info */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{selectedChallenge.title}</h3>
                  <div className="flex items-center space-x-2">
                    {selectedChallenge.featured && (
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    )}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedChallenge.difficulty)}`}>
                      {selectedChallenge.difficulty}
                    </span>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">{selectedChallenge.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-medium mb-2">Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Code className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-300">Category: {selectedChallenge.category.replace('-', ' ')}</span>
                      </div>
                      <div className="flex items-center">
                        <Award className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-300">Test Cases: {selectedChallenge.testCases}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-300">Languages: {selectedChallenge.languages.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-2">Statistics</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-700/30 rounded-lg p-3">
                        <div className="text-white font-semibold">{selectedChallenge.stats.attempts}</div>
                        <div className="text-gray-400 text-xs">Attempts</div>
                      </div>
                      <div className="bg-gray-700/30 rounded-lg p-3">
                        <div className="text-green-400 font-semibold">{selectedChallenge.stats.successRate.toFixed(1)}%</div>
                        <div className="text-gray-400 text-xs">Success Rate</div>
                      </div>
                      <div className="bg-gray-700/30 rounded-lg p-3">
                        <div className="text-blue-400 font-semibold">{selectedChallenge.stats.rating.toFixed(1)}</div>
                        <div className="text-gray-400 text-xs">Rating</div>
                      </div>
                      <div className="bg-gray-700/30 rounded-lg p-3">
                        <div className="text-yellow-400 font-semibold">{selectedChallenge.stats.averageTime.toFixed(1)}m</div>
                        <div className="text-gray-400 text-xs">Avg Time</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="text-white font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedChallenge.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Creator Info */}
              <div>
                <h4 className="text-white font-medium mb-2">Creator Information</h4>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white">{selectedChallenge.creator.name}</div>
                      <div className={`text-sm ${selectedChallenge.creator.type === 'admin' ? 'text-yellow-400' : 'text-gray-400'}`}>
                        {selectedChallenge.creator.type}
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-gray-300">Created: {formatDate(selectedChallenge.createdAt)}</div>
                      <div className="text-gray-400">Updated: {formatDate(selectedChallenge.updatedAt)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-700">
                {selectedChallenge.status === 'under-review' && (
                  <>
                    <button
                      onClick={() => {
                        handleChallengeAction('approve', selectedChallenge._id);
                        setShowChallengeModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      Approve Challenge
                    </button>
                    <button
                      onClick={() => {
                        handleChallengeAction('reject', selectedChallenge._id);
                        setShowChallengeModal(false);
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      Reject Challenge
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    handleChallengeAction('feature', selectedChallenge._id);
                    setShowChallengeModal(false);
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedChallenge.featured
                      ? 'bg-gray-600 hover:bg-gray-700 text-white'
                      : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  }`}
                >
                  {selectedChallenge.featured ? 'Remove from Featured' : 'Add to Featured'}
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  Edit Challenge
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ChallengeManagement;
