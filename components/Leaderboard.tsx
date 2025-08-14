'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { 
  Trophy, 
  Medal, 
  Crown, 
  TrendingUp,
  Zap,
  RefreshCw,
  Search
} from 'lucide-react';

interface LeaderboardUser {
  id: string;
  username: string;
  name: string;
  avatar: string;
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
  isOnline: boolean;
  isCurrentUser: boolean;
  lastActive: string;
  joinedDate: string;
}

interface LeaderboardProps {
  className?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ className = '' }) => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('totalPoints');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLeaderboard = useCallback(async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);

      const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
      const response = await fetch(`/api/users?sortBy=${sortBy}&order=desc&page=${page}&limit=20${searchParam}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }

      const result = await response.json();
      
      if (result.success) {
        setUsers(result.users || []);
        setTotalPages(result.pagination?.total || 1);
        setError(null);
      } else {
        throw new Error(result.error || 'Failed to fetch leaderboard');
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [sortBy, page, searchQuery]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const handleRefresh = () => {
    fetchLeaderboard(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page when searching
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-100" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-100" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-900" />;
    return <span className="text-gray-400 font-mono">#{rank}</span>;
  };

  const getRankBackground = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300/20 to-slate-300/20 border-gray-300/30';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600/20 to-orange-500/20 border-amber-600/30';
    return 'bg-gray-900/50 border-gray-800/50';
  };

  if (loading) {
    return (
      <div className={`bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6 ${className}`}>
        <div className="text-center text-red-400">
          <p className="text-lg font-semibold mb-2">Error Loading Leaderboard</p>
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
    <div className={`bg-gray-950 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="h-6 w-6 text-yellow-900" />
          <h2 className="text-2xl font-bold text-white">Global Leaderboard</h2>
          <div className="flex items-center gap-2 px-3 py-1  rounded-full">
            <TrendingUp className="w-4 h-4 text-yellow-950" />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 bg-gray-950 hover:bg-gray-900 rounded-lg text-gray-300 text-sm transition-colors disabled:opacity-50"
          >
            {refreshing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="totalPoints">Points</option>
            <option value="totalWins">Wins</option>
            <option value="winRate">Win Rate</option>
            <option value="rank">Rank</option>
          </select>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Rank</th>
              <th className="text-left py-3 px-4 text-gray-300 font-medium">User</th>
              <th className="text-center py-3 px-4 text-gray-300 font-medium">Points</th>
              <th className="text-center py-3 px-4 text-gray-300 font-medium">Wins</th>
              <th className="text-center py-3 px-4 text-gray-300 font-medium">Losses</th>
              <th className="text-center py-3 px-4 text-gray-300 font-medium">Win Rate</th>
              <th className="text-center py-3 px-4 text-gray-300 font-medium">Team</th>
              <th className="text-center py-3 px-4 text-gray-300 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <motion.tr
                key={user.id}
                className={`border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors ${
                  user.isCurrentUser ? 'bg-blue-600/10 border-blue-500/30' : ''
                } ${getRankBackground(user.rank)}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center w-12">
                    {getRankIcon(user.rank)}
                  </div>
                </td>
                
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                      )}
                      {user.isCurrentUser && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">★</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${user.isCurrentUser ? 'text-blue-400' : 'text-white'}`}>
                        {user.username}
                      </p>
                      <p className="text-gray-400 text-sm">{user.name}</p>
                    </div>
                  </div>
                </td>
                
                <td className="py-4 px-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    <span className="text-white font-bold">{user.totalPoints.toLocaleString()}</span>
                  </div>
                </td>
                
                <td className="py-4 px-4 text-center">
                  <span className="text-green-400 font-semibold">{user.totalWins}</span>
                </td>
                
                <td className="py-4 px-4 text-center">
                  <span className="text-red-400 font-semibold">{user.totalLosses}</span>
                </td>
                
                <td className="py-4 px-4 text-center">
                  <div className="flex items-center justify-center">
                    <div className={`px-2 py-1 rounded text-sm font-medium ${
                      user.winRate >= 70 ? 'bg-green-600/20 text-green-400' :
                      user.winRate >= 50 ? 'bg-yellow-600/20 text-yellow-400' :
                      'bg-red-600/20 text-red-400'
                    }`}>
                      {user.winRate}%
                    </div>
                  </div>
                </td>
                
                <td className="py-4 px-4 text-center">
                  {user.team ? (
                    <div className="flex items-center justify-center">
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{ backgroundColor: `${user.team.color}20`, color: user.team.color }}
                      >
                        {user.team.tag}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">Solo</span>
                  )}
                </td>
                
                <td className="py-4 px-4 text-center">
                  <div className="flex items-center justify-center">
                    {user.isOnline ? (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-sm">Online</span>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">Offline</span>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
          <div className="text-gray-400 text-sm">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-sm transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-sm transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* No Results */}
      {users.length === 0 && !loading && (
        <div className="text-center text-gray-400 py-12">
          <Trophy className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No users found</p>
          <p className="text-sm">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
