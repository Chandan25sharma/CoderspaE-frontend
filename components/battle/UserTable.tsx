'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  User, 
  Trophy, 
  Clock, 
  ChevronDown, 
  Users,
  RefreshCw,
  MessageCircle
} from 'lucide-react';
import DirectMessageModal from '@/components/chat/DirectMessageModal';
import ChallengeModal from '@/components/challenge/ChallengeModal';
import { useSocket } from '@/hooks/useSocket';

interface OnlineUser {
  _id: string;
  username: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  battlesWon: number;
  battlesLost: number;
  totalBattles: number;
  rating: number;
  preferredLanguage: string;
  githubProfile: {
    id?: string;
    username?: string;
    profileUrl?: string;
  };
  googleProfile: {
    id?: string;
    profileUrl?: string;
  };
  totalCodeExecutions: number;
  favoriteLanguages: string[];
  loginCount: number;
  lastLoginIp?: string;
  isVerified: boolean;
  joinedAt: string;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
  // Legacy fields for compatibility
  avatar?: string;
  isOnline?: boolean;
  totalPoints?: number;
  rank?: number;
  tier?: string;
  country?: string;
  bio?: string;
  winRate?: number;
  team?: {
    name: string;
    tag: string;
    color: string;
  } | null;
  isCurrentUser?: boolean;
}

interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  category: string[];
  tags: string[];
  timeLimit?: number;
  isActive: boolean;
}

interface UserTableProps {
  battleMode: string;
}

const UserTable: React.FC<UserTableProps> = ({ battleMode }) => {
  const router = useRouter();
  const [users, setUsers] = useState<OnlineUser[]>([]);
  const [allUsers, setAllUsers] = useState<OnlineUser[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [showOnlineOnly, setShowOnlineOnly] = useState(true);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<OnlineUser | null>(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showDirectMessageModal, setShowDirectMessageModal] = useState(false);
  const [directMessageTarget, setDirectMessageTarget] = useState<OnlineUser | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [challengeSetup, setChallengeSetup] = useState<{
    user: OnlineUser | null;
    problem: Problem | null;
    showTimeSetup: boolean;
    scheduledTime: string;
    scheduledDate: string;
  }>({
    user: null,
    problem: null,
    showTimeSetup: false,
    scheduledTime: '',
    scheduledDate: ''
  });
  const [page] = useState(1);
  const [sortBy] = useState('totalPoints');
  const [refreshing, setRefreshing] = useState(false);

  // Socket.IO integration for real-time challenges
  const {
    isConnected,
    incomingChallenge,
    sendChallenge,
    respondToChallenge,
    clearIncomingChallenge
  } = useSocket();

  const fetchUsers = useCallback(async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);

      // Fetch all users
      const allUsersResponse = await fetch(`/api/users?sortBy=${sortBy}&order=desc&page=${page}&limit=50`);
      if (!allUsersResponse.ok) {
        throw new Error('Failed to fetch users');
      }
      const allUsersResult = await allUsersResponse.json();
      
      // Fetch online users
      const onlineUsersResponse = await fetch(`/api/users?sortBy=${sortBy}&order=desc&page=${page}&limit=20&isOnline=true`);
      if (!onlineUsersResponse.ok) {
        throw new Error('Failed to fetch online users');
      }
      const onlineUsersResult = await onlineUsersResponse.json();

      if (allUsersResult.success && onlineUsersResult.success) {
        setAllUsers(allUsersResult.users || []);
        setOnlineUsers(onlineUsersResult.users || []);
        setUsers(showOnlineOnly ? (onlineUsersResult.users || []) : (allUsersResult.users || []));
        setError(null);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [sortBy, page, showOnlineOnly]);

  const fetchProblems = useCallback(async () => {
    try {
      const response = await fetch(`/api/problems?battleMode=${battleMode}&limit=50`);
      if (!response.ok) {
        throw new Error('Failed to fetch problems');
      }
      const result = await response.json();
      if (result.success) {
        setProblems(result.problems || []);
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  }, [battleMode]);

  useEffect(() => {
    fetchUsers();
    fetchProblems();
  }, [fetchUsers, fetchProblems]);

  const handleRefresh = () => {
    fetchUsers(true);
    fetchProblems();
  };

  const toggleUserFilter = (showOnline: boolean) => {
    setShowOnlineOnly(showOnline);
    setUsers(showOnline ? onlineUsers : allUsers);
  };

  const sendChallengeViaSocket = () => {
    if (!selectedUser || !selectedProblem) {
      alert('Please select a user and problem');
      return;
    }

    // Send challenge via Socket.IO for real-time delivery
    sendChallenge(selectedUser._id, [selectedProblem._id], selectedProblem.timeLimit || 30);
    
    // Close the modal and reset selection
    closeChallengeModal();
    alert(`Challenge sent to ${selectedUser.username}! They have 30 seconds to respond.`);
  };

  const handleChallengeAccept = () => {
    if (incomingChallenge) {
      respondToChallenge(incomingChallenge.challengeId, 'accepted');
    }
  };

  const handleChallengeReject = () => {
    if (incomingChallenge) {
      respondToChallenge(incomingChallenge.challengeId, 'rejected');
    }
  };

  const sendChallengeOld = async () => {
    if (!challengeSetup.user || !challengeSetup.problem || !challengeSetup.scheduledTime || !challengeSetup.scheduledDate) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengedUserId: challengeSetup.user._id,
          problemId: challengeSetup.problem._id,
          battleMode,
          scheduledDateTime: `${challengeSetup.scheduledDate}T${challengeSetup.scheduledTime}`,
          timeLimit: challengeSetup.problem.timeLimit
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Challenge sent to ${challengeSetup.user.username}!`);
        setChallengeSetup({
          user: null,
          problem: null,
          showTimeSetup: false,
          scheduledTime: '',
          scheduledDate: ''
        });
      } else {
        alert('Failed to send challenge: ' + result.error);
      }
    } catch (error) {
      console.error('Error sending challenge:', error);
      alert('Failed to send challenge');
    }
  };

  const challengeUserFunction = (userId: string, problem?: Problem) => {
    const user = users?.find((u: OnlineUser) => u._id === userId);
    if (user && problem) {
      setChallengeSetup({
        user,
        problem,
        showTimeSetup: true,
        scheduledTime: '',
        scheduledDate: new Date().toISOString().split('T')[0] // Today's date
      });
      closeChallengeModal();
    }
  };

  const openDirectMessage = (user: OnlineUser) => {
    setDirectMessageTarget(user);
    setShowDirectMessageModal(true);
  };

  const closeDirectMessage = () => {
    setShowDirectMessageModal(false);
    setDirectMessageTarget(null);
  };

  const openChallengeModal = (user: OnlineUser) => {
    setSelectedUser(user);
    setShowChallengeModal(true);
    setSearchTerm('');
    setSelectedProblem(null);
  };

  const closeChallengeModal = () => {
    setShowChallengeModal(false);
    setSelectedUser(null);
    setSelectedProblem(null);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleProblemSelect = (problem: Problem) => {
    setSelectedProblem(problem);
    setShowDropdown(false);
    setSearchTerm(problem.title);
  };

  const filteredProblems = problems.filter(problem =>
    problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.difficulty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (problem.category && problem.category.some(cat => 
      cat.toLowerCase().includes(searchTerm.toLowerCase())
    )) ||
    (problem.tags && problem.tags.some(tag => 
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

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
          <p className="text-lg font-semibold mb-2">Error Loading Users</p>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-950 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">
              {showOnlineOnly ? 'Online Users' : 'Users'}
            </h2>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full">
              <div className="w-2 h-2"></div>
              <span className="text-green-400 text-sm font-medium">Live</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* User Filter Toggle */}
            <div className="flex items-center gap-1 px-3 py-1 bg-gray-950 rounded-lg border border-gray-700/50">
              <button
                onClick={() => toggleUserFilter(true)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  showOnlineOnly
                    ? 'bg-green-600/20 text-green-900 border border-green-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Online ({onlineUsers.length})
              </button>
              <button
                onClick={() => toggleUserFilter(false)}
                className={`px-1 py-1 text-sm rounded transition-colors ${
                  !showOnlineOnly
                    ? 'bg-blue-800/20 text-blue-900 border border-blue-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                All ({allUsers.length})
              </button>
            </div>
            <p className="text-gray-400 text-sm">
              {showOnlineOnly 
                ? `${onlineUsers.length} users online` 
                : `${users.length} total users`}
            </p>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-400 text-sm transition-colors disabled:opacity-50"
            >
              {refreshing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </>
              )}
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-300 font-medium">User</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Rating</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Battles</th>
                <th className="text-right py-3 px-4 text-gray-300 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {(users || []).map((user: OnlineUser, index: number) => (
                <motion.tr
                  key={user._id}
                  className="border-b border-gray-900 hover:bg-gray-700/30 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full  flex items-center justify-center">
                          {user.image ? (
                            <Image 
                              src={user.image} 
                              alt={user.name} 
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-white" />
                          )}
                        </div>
                        {user.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-gray-400 text-sm">@{user.username}</p>

                        {user.team && (
                          <span
                            className="inline-block px-2 py-1 rounded text-xs font-medium mt-1"
                            style={{ backgroundColor: `${user.team.color}20`, color: user.team.color }}
                          >
                            {user.team.tag}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                        <span className={`text-sm font-medium ${user.isOnline ? 'text-green-400' : 'text-gray-400'}`}>
                          {user.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </div>
                      {user.isVerified && (
                        <span className="text-blue-400 text-xs">✓ Verified</span>
                      )}
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      <span className="text-white font-medium">{user.rating?.toLocaleString() || '1000'}</span>
                      <span className="text-gray-400 text-sm">rating</span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="text-white font-medium">{user.battlesWon || 0}W / {user.battlesLost || 0}L</span>
                      <span className="text-gray-400 text-xs">{user.totalBattles || 0} total</span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      
                      
                      {/* Challenge Button */}
                      <button
                        onClick={() => openChallengeModal(user)}
                        className="flex items-center gap-2 px-4 py-2 border border-blue-500/30 rounded-full text-blue-400 text-sm transition-colors"
                      >
                        Challenge
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Challenge Right Sidebar */}
      {showChallengeModal && selectedUser && (
        <motion.div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeChallengeModal}
        >
          <motion.div
            className="fixed right-0 top-0 h-full w-[580px] bg-gray-950 border-l border-gray-800 shadow-2xl overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full  flex items-center justify-center">
                    {selectedUser.image ? (
                      <Image 
                        src={selectedUser.image} 
                        alt={selectedUser.name} 
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">Challenge {selectedUser.username}</h4>
                    <p className="text-gray-400 text-sm">{selectedUser.name}</p>
                  </div>
                </div>
                <button
                  onClick={closeChallengeModal}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* User Stats */}
              <div className="mb-6 p-4 bg-gray-950  ">
                <h5 className="text-white font-medium mb-3">Player Stats</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{selectedUser.rating || 1000}</div>
                    <div className="text-gray-400 text-sm">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{selectedUser.battlesWon || 0}</div>
                    <div className="text-gray-400 text-sm">Wins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{selectedUser.battlesLost || 0}</div>
                    <div className="text-gray-400 text-sm">Losses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{selectedUser.totalBattles || 0}</div>
                    <div className="text-gray-400 text-sm">Total</div>
                  </div>
                </div>
              </div>

              {/* Select Problem Form */}
              <div className="mb-6">
                <label className="block text-white font-medium mb-3">
                  Select Problem
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={`Search ${problems.length} problems...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 300)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-900 rounded-lg text-white placeholder-gray-400 "
                  />
                  
                  {showDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 max-h-64 overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
                      {filteredProblems.length > 0 ? (
                        filteredProblems.map((problem) => (
                          <div
                            key={problem._id}
                            onMouseDown={() => handleProblemSelect(problem)}
                            className="p-4 cursor-pointer border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-medium text-white text-sm">
                                  {problem.title}
                                </p>
                                <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                                  {problem.description?.substring(0, 100)}...
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' : 
                                    problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 
                                    problem.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' : 
                                    'bg-purple-500/20 text-purple-400'
                                  }`}>
                                    {problem.difficulty}
                                  </span>
                                  <span className="text-gray-400 text-xs flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {problem.timeLimit || 30}m
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-gray-400">
                          {searchTerm ? (
                            <div>
                              <p className="font-medium mb-1">
                                No problems found for &quot;{searchTerm}&quot;
                              </p>
                              <p className="text-sm">
                                Try different keywords
                              </p>
                            </div>
                          ) : (
                            <div>
                              <p className="font-medium mb-2">Loading problems...</p>
                              <div className="w-6 h-6 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Problem Preview */}
              {selectedProblem && (
                <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <p className="font-medium text-white">
                          {selectedProblem.title}
                        </p>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">
                        {selectedProblem.description?.substring(0, 120)}...
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          selectedProblem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' : 
                          selectedProblem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 
                          selectedProblem.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' : 
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {selectedProblem.difficulty}
                        </span>
                        <span className="text-blue-400 text-sm flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {selectedProblem.timeLimit || 30} minutes
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedProblem(null)}
                      className="text-gray-400 hover:text-white p-1 rounded transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Battle Mode Selection */}
              <div className="mb-6">
                <label className="block text-white font-medium mb-3">Battle Mode</label>
                <div className="grid grid-cols-1 gap-2">
                  <div className="p-3 bg-gray-800 border border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Quick Battle</p>
                        <p className="text-gray-400 text-sm">Fast-paced coding challenge</p>
                      </div>
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={sendChallengeViaSocket}
                  disabled={!selectedProblem}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    selectedProblem
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isConnected ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      Send Live Challenge
                    </span>
                  ) : (
                    'Send Challenge (Offline)'
                  )}
                </button>
                
                <button
                  onClick={closeChallengeModal}
                  className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-800">
                <h6 className="text-gray-400 text-sm mb-3">Challenge Info</h6>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Battle Mode:</span>
                    <span className="text-white">Quick Battle</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time Limit:</span>
                    <span className="text-white">{selectedProblem?.timeLimit || 30} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Connection:</span>
                    <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
                      {isConnected ? 'Live' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Challenge Time Setup Modal */}
      {challengeSetup.showTimeSetup && challengeSetup.user && challengeSetup.problem && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setChallengeSetup(prev => ({ ...prev, showTimeSetup: false }))}
        >
          <motion.div
            className="bg-gray-900 border border-gray-700 rounded-xl max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-bold text-white">Schedule Challenge</h4>
                <button
                  onClick={() => setChallengeSetup(prev => ({ ...prev, showTimeSetup: false }))}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <p className="text-white font-semibold">{challengeSetup.problem.title}</p>
                <p className="text-gray-400 text-sm">vs {challengeSetup.user.username}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    challengeSetup.problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                    challengeSetup.problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {challengeSetup.problem.difficulty}
                  </span>
                  <span className="text-blue-400 text-sm">{challengeSetup.problem.timeLimit} minutes</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-white font-medium mb-2">Challenge Date</label>
                  <input
                    type="date"
                    value={challengeSetup.scheduledDate}
                    onChange={(e) => setChallengeSetup(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Challenge Time</label>
                  <input
                    type="time"
                    value={challengeSetup.scheduledTime}
                    onChange={(e) => setChallengeSetup(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setChallengeSetup(prev => ({ ...prev, showTimeSetup: false }))}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={sendChallengeOld}
                  disabled={!challengeSetup.scheduledTime || !challengeSetup.scheduledDate}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
                >
                  Send Challenge
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Real-time Challenge Request Modal */}
      <ChallengeModal
        challenge={incomingChallenge}
        onAccept={handleChallengeAccept}
        onReject={handleChallengeReject}
        onClose={clearIncomingChallenge}
      />

    </div>
  );
};

export default UserTable;
