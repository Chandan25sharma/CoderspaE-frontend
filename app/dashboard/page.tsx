'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useBattleSocket } from '@/hooks/useBattleSocket';
import { Swords, Trophy, Target, Clock, Users, Play, Loader } from 'lucide-react';

interface UserStats {
  rating?: number;
  battlesWon?: number;
  battlesLost?: number;
  totalBattles?: number;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { status: socketStatus, joinQueue, leaveQueue, error } = useBattleSocket();
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    // Fetch user stats
    if (session?.user?.id) {
      fetch('/api/socket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_user_stats', userId: session.user.id }),
      })
        .then(res => res.json())
        .then(data => setUserStats(data.stats))
        .catch(console.error);
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleJoinBattle = () => {
    if (socketStatus === 'connected') {
      joinQueue();
    }
  };

  const handleLeaveBattle = () => {
    if (socketStatus === 'waiting') {
      leaveQueue();
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {session.user.name}!
          </h1>
          <p className="text-gray-400">
            Ready to battle? Choose your challenge and show off your coding skills.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 p-6 rounded-lg border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Rating</p>
                <p className="text-2xl font-bold text-purple-400">
                  {userStats?.rating || 1000}
                </p>
              </div>
              <Trophy className="h-8 w-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-lg border border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Battles Won</p>
                <p className="text-2xl font-bold text-green-400">
                  {userStats?.battlesWon || 0}
                </p>
              </div>
              <Target className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-lg border border-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Battles Lost</p>
                <p className="text-2xl font-bold text-red-400">
                  {userStats?.battlesLost || 0}
                </p>
              </div>
              <Clock className="h-8 w-8 text-red-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-lg border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Battles</p>
                <p className="text-2xl font-bold text-blue-400">
                  {userStats?.totalBattles || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Battle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Join Battle */}
          <div className="bg-slate-800/50 p-8 rounded-lg border border-purple-500/20">
            <div className="text-center">
              <Swords className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Quick Battle</h2>
              <p className="text-gray-400 mb-6">
                Join the queue and get matched with an opponent for a real-time coding battle.
              </p>

              {/* Connection Status */}
              <div className="mb-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    socketStatus === 'connected' ? 'bg-green-400' : 
                    socketStatus === 'connecting' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}></div>
                  <span className="text-sm text-gray-400">
                    {socketStatus === 'connected' ? 'Connected' :
                     socketStatus === 'connecting' ? 'Connecting...' :
                     socketStatus === 'waiting' ? 'Searching for opponent...' :
                     socketStatus === 'matched' ? 'Match found!' :
                     'Disconnected'}
                  </span>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {socketStatus === 'waiting' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader className="h-5 w-5 animate-spin text-purple-400" />
                    <span className="text-purple-400">Searching for opponent...</span>
                  </div>
                  <button
                    onClick={handleLeaveBattle}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Cancel Search
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleJoinBattle}
                  disabled={socketStatus !== 'connected'}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Play className="h-5 w-5" />
                  <span>Find Battle</span>
                </button>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-800/50 p-8 rounded-lg border border-blue-500/20">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <div className="text-center text-gray-400 py-8">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent battles</p>
                <p className="text-sm">Start your first battle to see your activity here</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 p-6 rounded-lg border border-yellow-500/20 text-center">
            <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Leaderboard</h3>
            <p className="text-gray-400 mb-4">See how you rank against other developers</p>
            <button
              onClick={() => router.push('/leaderboard')}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              View Rankings
            </button>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-lg border border-green-500/20 text-center">
            <Target className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Practice</h3>
            <p className="text-gray-400 mb-4">Sharpen your skills with coding challenges</p>
            <button
              onClick={() => router.push('/practice')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Start Practice
            </button>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-lg border border-pink-500/20 text-center">
            <Users className="h-12 w-12 text-pink-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Tournaments</h3>
            <p className="text-gray-400 mb-4">Join upcoming tournaments and events</p>
            <button
              onClick={() => router.push('/tournaments')}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              View Events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
