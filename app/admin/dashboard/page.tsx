'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Swords,
  Brain,
  Trophy,
  Activity,
  TrendingUp,
  AlertTriangle,
  Clock,
  Globe
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  liveBattles: number;
  totalBattles: number;
  totalChallenges: number;
  reportsToday: number;
  userGrowth: number;
  battleGrowth: number;
}

interface RecentActivity {
  id: string;
  type: 'user_joined' | 'battle_completed' | 'challenge_added' | 'report_filed';
  description: string;
  timestamp: string;
  user?: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 1247,
    activeUsers: 89,
    liveBattles: 12,
    totalBattles: 3451,
    totalChallenges: 156,
    reportsToday: 3,
    userGrowth: 12.5,
    battleGrowth: 8.3
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'user_joined',
      description: 'New user registered: john.doe@gmail.com',
      timestamp: '2 minutes ago',
      user: 'john.doe@gmail.com'
    },
    {
      id: '2',
      type: 'battle_completed',
      description: 'Battle completed: Array Manipulation Challenge',
      timestamp: '5 minutes ago'
    },
    {
      id: '3',
      type: 'challenge_added',
      description: 'New challenge added: Binary Tree Traversal',
      timestamp: '1 hour ago'
    },
    {
      id: '4',
      type: 'report_filed',
      description: 'User reported for suspicious activity',
      timestamp: '2 hours ago'
    }
  ]);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      growth: stats.userGrowth,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toString(),
      icon: Activity,
      growth: null,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Live Battles',
      value: stats.liveBattles.toString(),
      icon: Swords,
      growth: null,
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'Total Battles',
      value: stats.totalBattles.toLocaleString(),
      icon: Trophy,
      growth: stats.battleGrowth,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Challenges',
      value: stats.totalChallenges.toString(),
      icon: Brain,
      growth: null,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Reports Today',
      value: stats.reportsToday.toString(),
      icon: AlertTriangle,
      growth: null,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user_joined':
        return Users;
      case 'battle_completed':
        return Swords;
      case 'challenge_added':
        return Brain;
      case 'report_filed':
        return AlertTriangle;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user_joined':
        return 'text-green-400';
      case 'battle_completed':
        return 'text-blue-400';
      case 'challenge_added':
        return 'text-purple-400';
      case 'report_filed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <AdminLayout activeSection="dashboard">
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{card.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
                  {card.growth && (
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                      <span className="text-green-400 text-sm">+{card.growth}%</span>
                      <span className="text-gray-500 text-sm ml-1">vs last month</span>
                    </div>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                <button className="text-blue-400 hover:text-blue-300 text-sm">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                      <div className={`w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center`}>
                        <Icon className={`h-4 w-4 ${getActivityColor(activity.type)}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm">{activity.description}</p>
                        <div className="flex items-center mt-1">
                          <Clock className="h-3 w-3 text-gray-500 mr-1" />
                          <span className="text-gray-500 text-xs">{activity.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  <Brain className="h-5 w-5 text-white mr-3" />
                  <span className="text-white font-medium">Add Challenge</span>
                </button>
                
                <button className="w-full flex items-center p-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                  <Users className="h-5 w-5 text-white mr-3" />
                  <span className="text-white font-medium">Manage Users</span>
                </button>
                
                <button className="w-full flex items-center p-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                  <Globe className="h-5 w-5 text-white mr-3" />
                  <span className="text-white font-medium">Send Announcement</span>
                </button>
                
                <button className="w-full flex items-center p-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                  <AlertTriangle className="h-5 w-5 text-white mr-3" />
                  <span className="text-white font-medium">Review Reports</span>
                </button>
              </div>
            </motion.div>

            {/* System Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 mt-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Battle Server</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-green-400 text-sm">Online</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Database</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-green-400 text-sm">Healthy</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">AI Service</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                    <span className="text-yellow-400 text-sm">Limited</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
