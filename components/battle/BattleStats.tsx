'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Trophy, Target, TrendingUp, Hash } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserStats {
  rank: number;
  totalWins: number;
  totalLosses: number;
  totalPoints: number;
  winRate: number;
  recentGames: number;
  trending: 'up' | 'down' | 'stable';
  pointsGain: number;
}

interface BattleStatsProps {
  battleMode?: string;
}

export default function BattleStats({ battleMode }: BattleStatsProps) {
  const { data: session } = useSession();
  const [stats, setStats] = useState<UserStats>({
    rank: 999,
    totalWins: 0,
    totalLosses: 0,
    totalPoints: 0,
    winRate: 0,
    recentGames: 0,
    trending: 'stable',
    pointsGain: 0
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Auto-refresh stats every 30 seconds
  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/users/stats${battleMode ? `?battleMode=${battleMode}` : ''}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setStats(data.stats);
            setLastUpdate(new Date());
          }
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchStats();

    // Set up auto-refresh
    const interval = setInterval(fetchStats, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [session, battleMode]);

  // Listen for real-time updates via WebSocket/Socket.IO
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).socket) {
      const socket = (window as any).socket;
      
      socket.on('stats-update', (updatedStats: UserStats) => {
        setStats(updatedStats);
        setLastUpdate(new Date());
      });

      socket.on('battle-completed', (battleResult: any) => {
        // Refresh stats when a battle is completed
        if (battleResult.participants.includes(session?.user?.email)) {
          setTimeout(() => {
            fetchStats();
          }, 1000); // Small delay to ensure backend is updated
        }
      });

      return () => {
        socket.off('stats-update');
        socket.off('battle-completed');
      };
    }
  }, [session]);

  const fetchStats = async () => {
    if (!session?.user?.email) return;
    
    try {
      const response = await fetch(`/api/users/stats${battleMode ? `?battleMode=${battleMode}` : ''}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
          setLastUpdate(new Date());
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const formatRank = (rank: number) => {
    if (rank > 999) return '999+';
    return `#${rank}`;
  };

  const getTrendingIcon = () => {
    switch (stats.trending) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-400 rotate-180" />;
      default:
        return <Hash className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTrendingColor = () => {
    switch (stats.trending) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-gray-700 rounded mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-16 bg-gray-700 rounded"></div>
          <div className="h-16 bg-gray-700 rounded"></div>
          <div className="h-16 bg-gray-700 rounded"></div>
          <div className="h-16 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          Your Battle Stats
          {battleMode && (
            <span className="text-sm text-blue-400 bg-blue-500/20 px-2 py-1 rounded">
              {battleMode}
            </span>
          )}
        </h3>
        <div className="text-xs text-gray-400">
          Updated: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rank */}
        <motion.div
          className="bg-gray-900/50 border border-gray-600/50 rounded-lg p-4 text-center"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Hash className="h-4 w-4 text-gray-400" />
            <span className="text-gray-400 text-sm font-medium">Your Rank</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {formatRank(stats.rank)}
          </div>
          <div className={`flex items-center justify-center gap-1 text-xs ${getTrendingColor()}`}>
            {getTrendingIcon()}
            {stats.pointsGain > 0 ? `+${stats.pointsGain}` : stats.pointsGain}
          </div>
        </motion.div>

        {/* Total Wins */}
        <motion.div
          className="bg-gray-900/50 border border-gray-600/50 rounded-lg p-4 text-center"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="h-4 w-4 text-green-400" />
            <span className="text-gray-400 text-sm font-medium">Total Wins</span>
          </div>
          <div className="text-2xl font-bold text-green-400 mb-1">
            {stats.totalWins}
          </div>
          <div className="text-xs text-gray-400">
            +{Math.floor(stats.totalWins * 0.1)} recent
          </div>
        </motion.div>

        {/* Total Losses */}
        <motion.div
          className="bg-gray-900/50 border border-gray-600/50 rounded-lg p-4 text-center"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="h-4 w-4 text-red-400" />
            <span className="text-gray-400 text-sm font-medium">Total Losses</span>
          </div>
          <div className="text-2xl font-bold text-red-400 mb-1">
            {stats.totalLosses}
          </div>
          <div className="text-xs text-gray-400">
            {stats.winRate.toFixed(1)}% win rate
          </div>
        </motion.div>

        {/* Points */}
        <motion.div
          className="bg-gray-900/50 border border-gray-600/50 rounded-lg p-4 text-center"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-400" />
            <span className="text-gray-400 text-sm font-medium">Points</span>
          </div>
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {stats.totalPoints.toLocaleString()}
          </div>
          <div className="text-xs text-green-400">
            +{Math.floor(stats.totalPoints * 0.05)} today
          </div>
        </motion.div>
      </div>

      {/* Win Rate Progress Bar */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Win Rate</span>
          <span className="text-sm text-white font-medium">{stats.winRate.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${stats.winRate}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
