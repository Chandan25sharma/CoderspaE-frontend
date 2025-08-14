'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MatrixRain from '@/components/MatrixRain';
import {
  Users,
  Swords,
  Brain,
  Activity,
  AlertTriangle,
  Shield,
  BarChart3,
  Settings,
  Eye,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalBattles: number;
  activeBattles: number;
  totalChallenges: number;
  pendingReports: number;
  totalTeams: number;
  onlineUsers: number;
}

interface RecentActivity {
  id: string;
  type: 'user_registered' | 'battle_completed' | 'challenge_created' | 'report_submitted' | 'team_created' | 'user_login';
  description: string;
  timestamp: string;
  user?: string;
  ipAddress?: string;
  userAgent?: string;
}

interface UserSession {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  loginTime: string;
  lastActivity: string;
  ipAddress: string;
  isActive: boolean;
  device: string;
  browser: string;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [userSessions, setUserSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    // Check if user is admin
    if (session.user && (session.user as any).role !== 'admin') {
      router.push('/');
      return;
    }
    
    fetchAdminData();
  }, [session, router]);

  const fetchAdminData = async () => {
    try {
      // Fetch dashboard stats
      const statsResponse = await fetch('/api/admin/analytics');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      } else {
        // Mock data if API not ready
        const mockStats: DashboardStats = {
          totalUsers: 15247,
          activeUsers: 3428,
          totalBattles: 8932,
          activeBattles: 23,
          totalChallenges: 342,
          pendingReports: 7,
          totalTeams: 156,
          onlineUsers: 234
        };
        setStats(mockStats);
      }

      // Fetch recent activity
      const activityResponse = await fetch('/api/admin/activity');
      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        setRecentActivity(activityData);
      } else {
        // Mock activity data
        const mockActivity: RecentActivity[] = [
          {
            id: '1',
            type: 'user_registered',
            description: 'New user registered: john.doe@example.com',
            timestamp: new Date().toISOString(),
            user: 'john.doe@example.com',
            ipAddress: '192.168.1.100'
          },
          {
            id: '2',
            type: 'battle_completed',
            description: 'Battle completed: Quick Duel #8934',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            user: 'alice@example.com'
          },
          {
            id: '3',
            type: 'team_created',
            description: 'New team created: Code Warriors',
            timestamp: new Date(Date.now() - 600000).toISOString(),
            user: 'teamlead@example.com'
          }
        ];
        setRecentActivity(mockActivity);
      }

      // Fetch user sessions
      const sessionsResponse = await fetch('/api/admin/sessions');
      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json();
        setUserSessions(sessionsData);
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session || !(session.user as any)?.role || (session.user as any).role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Matrix Rain Effect */}
      <MatrixRain opacity={0.1} density={50} />
      
      {/* Navigation */}
      <div className="relative z-20 pt-6 px-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <motion.button
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-gray-800 hover:bg-gray-700/50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </motion.button>
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="w-32"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats && [
                { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'blue' },
                { label: 'Active Users', value: stats.activeUsers, icon: Activity, color: 'green' },
                { label: 'Total Battles', value: stats.totalBattles, icon: Swords, color: 'purple' },
                { label: 'Active Battles', value: stats.activeBattles, icon: Brain, color: 'orange' },
                { label: 'Total Teams', value: stats.totalTeams, icon: Shield, color: 'indigo' },
                { label: 'Online Now', value: stats.onlineUsers, icon: Eye, color: 'emerald' },
                { label: 'Challenges', value: stats.totalChallenges, icon: BarChart3, color: 'cyan' },
                { label: 'Reports', value: stats.pendingReports, icon: AlertTriangle, color: 'red' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                    </div>
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-lg"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Recent Activity
                </h2>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-gray-900 text-sm">{activity.description}</p>
                        <p className="text-gray-500 text-xs">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                        {activity.ipAddress && (
                          <p className="text-gray-400 text-xs">IP: {activity.ipAddress}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* User Sessions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-lg"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Active Sessions
                </h2>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {userSessions.slice(0, 10).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-gray-900 text-sm font-medium">{session.userName}</p>
                        <p className="text-gray-500 text-xs">{session.userEmail}</p>
                        <p className="text-gray-400 text-xs">{session.device} • {session.browser}</p>
                      </div>
                      <div className="text-right">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(session.lastActivity).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Manage Users', icon: Users, href: '/admin/users' },
                  { label: 'View Battles', icon: Swords, href: '/admin/battles' },
                  { label: 'Challenges', icon: Brain, href: '/admin/challenges' },
                  { label: 'Analytics', icon: BarChart3, href: '/admin/analytics' }
                ].map((action, index) => (
                  <Link key={action.label} href={action.href}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors text-left"
                    >
                      <action.icon className="w-6 h-6 text-blue-600 mb-2" />
                      <p className="text-gray-900 font-medium">{action.label}</p>
                    </motion.button>
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
