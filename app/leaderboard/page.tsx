'use client';
import { useEffect, useState } from 'react';
import { Trophy, Medal, Crown, TrendingUp, Users, Target } from 'lucide-react';


interface LeaderboardUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  rating: number;
  battlesWon: number;
  battlesLost: number;
  totalBattles: number;
  winRate: number;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'all-time' | 'monthly' | 'weekly'>('all-time');

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      // For demo purposes, we'll create mock data
      // In a real app, this would fetch from your API
      const mockUsers: LeaderboardUser[] = [
       
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-400">#{position}</span>;
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 1800) return 'text-purple-400';
    if (rating >= 1600) return 'text-blue-400';
    if (rating >= 1400) return 'text-green-400';
    if (rating >= 1200) return 'text-yellow-400';
    return 'text-gray-400';
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="h-12 w-12 text-yellow-400 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Global Leaderboard
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            See how you rank against the world&apos;s best coders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 p-6 rounded-lg border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Players</p>
                <p className="text-2xl font-bold text-purple-400">12,847</p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-lg border border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Battles Today</p>
                <p className="text-2xl font-bold text-green-400">2,341</p>
              </div>
              <Target className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-lg border border-yellow-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Rating</p>
                <p className="text-2xl font-bold text-yellow-400">1,247</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Timeframe Filter */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/50 p-1 rounded-lg border border-purple-500/20">
            {(['all-time', 'monthly', 'weekly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  timeframe === period
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {period === 'all-time' ? 'All Time' : 
                 period === 'monthly' ? 'This Month' : 'This Week'}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-slate-800/50 rounded-lg border border-purple-500/20 overflow-hidden">
          <div className="p-6 border-b border-purple-500/20">
            <h2 className="text-xl font-bold text-white">Top Performers</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
              <p className="text-gray-400 mt-2">Loading leaderboard...</p>
            </div>
          ) : (
            <div className="divide-y divide-purple-500/20">
              {users.map((user, index) => (
                <div
                  key={user._id}
                  className={`p-6 flex items-center space-x-4 hover:bg-slate-700/30 transition-colors ${
                    index < 3 ? 'bg-gradient-to-r from-slate-800/50 to-transparent' : ''
                  }`}
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center w-12">
                    {getRankIcon(index + 1)}
                  </div>

                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {user.image ? (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 p-0.5">
                        <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-white font-semibold truncate">{user.name}</h3>
                      {index < 3 && (
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          index === 0 ? 'bg-yellow-400/20 text-yellow-400' :
                          index === 1 ? 'bg-gray-400/20 text-gray-400' :
                          'bg-amber-600/20 text-amber-400'
                        }`}>
                          {index === 0 ? 'Champion' : index === 1 ? 'Elite' : 'Master'}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm truncate">{user.email}</p>
                  </div>

                  {/* Stats */}
                  <div className="hidden sm:flex flex-col items-center">
                    <span className="text-xs text-gray-400">Win Rate</span>
                    <span className="text-white font-semibold">{user.winRate}%</span>
                  </div>

                  <div className="hidden md:flex flex-col items-center">
                    <span className="text-xs text-gray-400">Battles</span>
                    <span className="text-white font-semibold">{user.totalBattles}</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-400">Rating</span>
                    <span className={`text-lg font-bold ${getRatingColor(user.rating)}`}>
                      {user.rating.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Your Ranking */}
        <div className="mt-8 bg-slate-800/50 rounded-lg border border-blue-500/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Your Current Ranking</h3>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
              <span className="text-white font-semibold">?</span>
            </div>
            <div className="flex-1">
              <p className="text-white">Sign in to see your ranking</p>
              <p className="text-gray-400 text-sm">Battle other coders to climb the leaderboard</p>
            </div>
            <div className="text-right">
              <p className="text-blue-400 font-semibold">Unranked</p>
              <p className="text-gray-400 text-sm">Join battles to get ranked</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
