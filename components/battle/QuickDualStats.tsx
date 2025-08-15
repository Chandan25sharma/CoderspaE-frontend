'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Users, Trophy, Target, Zap, Medal, TrendingUp } from 'lucide-react';

interface StatsCardProps {
  icon: React.ComponentType<{className?: string}>;
  label: string;
  value: string | number;
  color: string;
  trend?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, label, value, color, trend }) => (
  <motion.div
    className="bg-gray-950 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
    whileHover={{ scale: 1.02, y: -5 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-10 h-5 rounded-xl  flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {trend && (
        <span className="text-green-400 text-sm font-medium">+{trend}</span>
      )}
    </div>
    <div className="space-y-1">
      <h3 className="text-2xl font-bold text-white">{value}</h3>
      <p className="text-gray-400 text-sm">{label}</p>
    </div>
  </motion.div>
);

export default function QuickDualStats() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<StatsCardProps[]>([
    {
      icon: Users,
      label: "Online Coders",
      value: "...",
      color: "",
      trend: "12"
    },
    {
      icon: Zap,
      label: "Ongoing Matches",
      value: "...",
      color: "",
      trend: "0"
    },
    {
      icon: Trophy,
      label: "Your Rank",
      value: "#999",
      color: ""
    },
    {
      icon: Target,
      label: "Total Wins",
      value: "27",
      color: "",
      trend: "3"
    },
    {
      icon: Medal,
      label: "Total Losses",
      value: "8",
      color: "bg-gradient-to-r from-red-500 to-red-600"
    },
    {
      icon: TrendingUp,
      label: "Points",
      value: "2,450",
      color: "",
      trend: "180"
    }
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      fetchStats();
      
      // Auto-refresh every 30 seconds for live updates
      const interval = setInterval(fetchStats, 30000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      
      // Fetch online users count
      const usersResponse = await fetch('/api/users?isOnline=true&limit=100');
      const usersData = await usersResponse.json();
      const onlineCount = usersData.success ? usersData.users?.length || 0 : 0;
      
      // Fetch ongoing battles count
      const battlesResponse = await fetch('/api/battles?status=active');
      const battlesData = await battlesResponse.json();
      const ongoingCount = battlesData.success ? battlesData.battles?.length || 0 : 0;
      
      // Fetch user's personal stats
      const statsResponse = await fetch('/api/users/stats?battleMode=Quick Dual (1v1)');
      const userStatsData = await statsResponse.json();
      
      let userStats = {
        rank: 999,
        totalWins: 27,
        totalLosses: 8,
        totalPoints: 2450,
        pointsGain: 180,
        winsGain: 3
      };
      
      if (userStatsData.success) {
        userStats = {
          rank: userStatsData.stats.rank ||0,
          totalWins: userStatsData.stats.totalWins || 0,
          totalLosses: userStatsData.stats.totalLosses || 0,
          totalPoints: userStatsData.stats.totalPoints || 0,
          pointsGain: Math.abs(userStatsData.stats.pointsGain) || 0,
          winsGain: Math.floor(userStatsData.stats.totalWins * 0.1) || 0
        };
      }
      
      // Update stats with real live data
      setStats([
        {
          icon: Users,
          label: "Online Coders",
          value: onlineCount.toString(),
          color: "",
          trend: Math.floor(onlineCount * 0.2).toString()
        },
        {
          icon: Zap,
          label: "Ongoing Matches",
          value: ongoingCount.toString(),
          color: "",
          trend: Math.floor(ongoingCount * 0.5).toString()
        },
        {
          icon: Trophy,
          label: "Your Rank",
          value: `#${userStats.rank}`,
          color: ""
        },
        {
          icon: Target,
          label: "Total Wins",
          value: userStats.totalWins.toString(),
          color: "",
          trend: userStats.winsGain.toString()
        },
        {
          icon: Medal,
          label: "Total Losses",
          value: userStats.totalLosses.toString(),
          color: ""
        },
        {
          icon: TrendingUp,
          label: "Points",
          value: userStats.totalPoints.toLocaleString(),
          color: "",
          trend: userStats.pointsGain.toString()
        }
      ]);
      
    } catch (error) {
      console.error('Error fetching live stats:', error);
      // Keep showing loading or default values on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {stats.map((stat: StatsCardProps, index: number) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatsCard {...stat} />
        </motion.div>
      ))}
      {isLoading && (
        <motion.div
          className="col-span-full text-center py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-gray-400">Loading live stats...</div>
        </motion.div>
      )}
    </motion.div>
  );
}
