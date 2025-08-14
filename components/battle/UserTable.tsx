'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
  id: string;
  username: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  totalPoints: number;
  totalWins: number;
  totalLosses: number;
  winRate: number;
  rank: number;
  team: {
    name: string;
    tag: string;
    color: string;
  } | null;
  lastActive: string;
  isCurrentUser: boolean;
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
    sendChallenge(selectedUser.id, [selectedProblem._id], selectedProblem.timeLimit || 30);
    
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
          challengedUserId: challengeSetup.user.id,
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

  const joinSpectate = (targetUser: OnlineUser) => {
    // Navigate to live streaming page for the user's battle
    const battleModeSlug = battleMode.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    router.push(`/battle/${battleModeSlug}/live?spectate=${targetUser.id}&user=${targetUser.username}`);
  };

  const challengeUserFunction = (userId: string, problem?: Problem) => {
    const user = users?.find((u: OnlineUser) => u.id === userId);
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

  const spectateUserFunction = (userId: string) => {
    const user = users?.find((u: OnlineUser) => u.id === userId);
    if (user) {
      joinSpectate(user);
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
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">
              {showOnlineOnly ? 'Online Users' : 'All Users'}
            </h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-600/20 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Live</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* User Filter Toggle */}
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <button
                onClick={() => toggleUserFilter(true)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  showOnlineOnly
                    ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Online ({onlineUsers.length})
              </button>
              <button
                onClick={() => toggleUserFilter(false)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  !showOnlineOnly
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
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
              className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-400 text-sm transition-colors disabled:opacity-50"
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
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Points</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Rank</th>
                <th className="text-right py-3 px-4 text-gray-300 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {(users || []).map((user: OnlineUser, index: number) => (
                <motion.tr
                  key={user.id}
                  className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10  flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        {user.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.username}</p>
                        <p className="text-gray-400 text-sm">{user.name}</p>
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
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm font-medium">Online</span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-400" />
                      <span className="text-white font-medium">{user.totalPoints.toLocaleString()}</span>
                      <span className="text-gray-400 text-sm">pts</span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <span className="text-white font-mono">#{user.rank}</span>
                  </td>
                  
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      {/* Watch Button */}
                      <button
                        onClick={() => joinSpectate(user)}
                        className="flex items-center gap-1 px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-full text-purple-400 text-xs transition-colors"
                      >
                        Watch
                      </button>
                      
                      {/* Message Button */}
                      <button
                        onClick={() => openDirectMessage(user)}
                        className="flex items-center gap-1 px-3 py-1 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-full text-green-400 text-xs transition-colors"
                      >
                        Message
                      </button>
                      
                      {/* Challenge Button */}
                      <button
                        onClick={() => openChallengeModal(user)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-full text-blue-400 text-sm transition-colors"
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

      {/* Challenge Modal - Sales Person Selector Style */}
      {showChallengeModal && selectedUser && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeChallengeModal}
        >
          <motion.div
            className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-gray-800">⚔️ Challenge {selectedUser.username}</h4>
                <button
                  onClick={closeChallengeModal}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ✕
                </button>
              </div>
              
              {/* Select Problem - Sales Person Selector Style */}
              <div style={{ flex: 1, minWidth: 250, position: 'relative', marginBottom: 20 }}>
                <label style={{ fontWeight: 'bold', marginBottom: 6, display: 'block', color: '#333' }}>
                  Select Problem (Quick Battle Mode Only) - {problems.length} available
                </label>
                <div style={{ border: '1px solid #ccc', borderRadius: 6, background: '#fff', position: 'relative' }}>
                  <input
                    type="text"
                    placeholder={`Search ${problems.length} problems by title, difficulty, or category...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 300)}
                    style={{
                      width: '100%',
                      padding: 12,
                      border: 'none',
                      outline: 'none',
                      borderRadius: 6,
                      fontSize: 14,
                      backgroundColor: '#f9fafb'
                    }}
                  />
                  
                  {showDropdown && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      maxHeight: 400,
                      overflowY: 'auto',
                      border: '1px solid #ccc',
                      background: '#fff',
                      borderRadius: 6,
                      marginTop: 2,
                      zIndex: 1000,
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                    }}>
                      {filteredProblems.length > 0 ? (
                        filteredProblems.map((problem) => (
                          <div
                            key={problem._id}
                            onMouseDown={() => handleProblemSelect(problem)}
                            style={{
                              padding: 15,
                              cursor: 'pointer',
                              borderBottom: '1px solid #eee',
                              backgroundColor: 'transparent',
                              transition: 'background-color 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#f8fafc';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: '600', color: '#1f2937', margin: 0, fontSize: 15, lineHeight: '1.4' }}>
                                  {problem.title}
                                </p>
                                <p style={{ color: '#6b7280', fontSize: 12, margin: '4px 0 8px 0', lineHeight: '1.3' }}>
                                  {problem.description?.substring(0, 120)}...
                                </p>
                                <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
                                  <span style={{
                                    padding: '3px 8px',
                                    borderRadius: 4,
                                    fontSize: 11,
                                    fontWeight: '600',
                                    backgroundColor: problem.difficulty === 'Easy' ? '#dcfce7' : 
                                                   problem.difficulty === 'Medium' ? '#fef3c7' : 
                                                   problem.difficulty === 'Hard' ? '#fee2e2' : '#f3e8ff',
                                    color: problem.difficulty === 'Easy' ? '#166534' : 
                                           problem.difficulty === 'Medium' ? '#92400e' : 
                                           problem.difficulty === 'Hard' ? '#991b1b' : '#7c3aed'
                                  }}>
                                    {problem.difficulty}
                                  </span>
                                  <span style={{ fontSize: 11, color: '#6b7280', fontWeight: '500' }}>
                                    ⏱️ {problem.timeLimit || 30} minutes
                                  </span>
                                  {problem.category && problem.category.length > 0 && (
                                    <span style={{ fontSize: 11, color: '#059669', fontWeight: '500' }}>
                                      📂 {problem.category[0]}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: 20, textAlign: 'center', color: '#6b7280', fontSize: 14 }}>
                          {searchTerm ? (
                            <div>
                              <p style={{ margin: '0 0 8px 0', fontWeight: '500' }}>
                                No Quick Battle problems found for &ldquo;{searchTerm}&rdquo;
                              </p>
                              <p style={{ margin: 0, fontSize: 12 }}>
                                Try searching with different keywords or browse all problems below
                              </p>
                            </div>
                          ) : (
                            <div>
                              <p style={{ margin: '0 0 8px 0', fontWeight: '500' }}>
                                Loading Quick Battle problems...
                              </p>
                              <div style={{ 
                                width: 20, 
                                height: 20, 
                                border: '2px solid #e5e7eb',
                                borderTop: '2px solid #3b82f6',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                margin: '0 auto'
                              }}></div>
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
                <div style={{ 
                  marginBottom: 20, 
                  padding: 12, 
                  backgroundColor: '#f8fafc', 
                  borderRadius: 6,
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: 'medium', color: '#333', margin: 0 }}>
                        ✅ {selectedProblem.title}
                      </p>
                      <p style={{ color: '#666', fontSize: 12, margin: '4px 0 0 0' }}>
                        {selectedProblem.description?.substring(0, 80)}...
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedProblem(null)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#666', 
                        cursor: 'pointer',
                        fontSize: 16
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  onClick={closeChallengeModal}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #ccc',
                    borderRadius: 6,
                    background: '#fff',
                    color: '#666',
                    cursor: 'pointer',
                    fontSize: 14
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={sendChallengeViaSocket}
                  disabled={!selectedProblem}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: 6,
                    background: selectedProblem ? '#3b82f6' : '#ccc',
                    color: '#fff',
                    cursor: selectedProblem ? 'pointer' : 'not-allowed',
                    fontSize: 14,
                    fontWeight: 'medium'
                  }}
                >
                  {isConnected ? 'Send Live Challenge' : 'Send Challenge (Offline)'}
                </button>
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

      {/* Direct Message Modal */}
      {showDirectMessageModal && directMessageTarget && (
        <DirectMessageModal
          isOpen={showDirectMessageModal}
          targetUser={directMessageTarget}
          onClose={closeDirectMessage}
        />
      )}
    </div>
  );
};

export default UserTable;
