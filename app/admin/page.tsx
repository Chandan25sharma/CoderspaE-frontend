'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Swords,
  Brain,
  Activity,
  TrendingUp,
  AlertTriangle,
  Shield,
  Plus,
  BarChart3
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalBattles: number;
  activeBattles: number;
  totalChallenges: number;
  pendingReports: number;
}

interface RecentActivity {
  id: string;
  type: 'user_registered' | 'battle_completed' | 'challenge_created' | 'report_submitted';
  description: string;
  timestamp: string;
  user?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in production, fetch from API
    const mockStats: DashboardStats = {
      totalUsers: 15247,
      activeUsers: 3428,
      totalBattles: 8932,
      activeBattles: 23,
      totalChallenges: 342,
      pendingReports: 7
    };

    const mockActivity: RecentActivity[] = [
      {
        id: '1',
        type: 'user_registered',
        description: 'New user Sarah Wilson registered',
        timestamp: '2024-01-20T15:30:00Z',
        user: 'Sarah Wilson'
      }
    ];

    setTimeout(() => {
      setStats(mockStats);
      setRecentActivity(mockActivity);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <AdminLayout activeSection="dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading dashboard...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeSection="dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome to the CoderspaE admin panel</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{stats?.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
