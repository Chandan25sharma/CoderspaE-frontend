'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Swords,
  Clock,
  Target,
  Activity,
  Download,
  RefreshCw,
  Award,
  Zap,
  AlertTriangle
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalBattles: number;
    totalChallenges: number;
    userGrowth: number;
    battleGrowth: number;
    challengeGrowth: number;
    engagementRate: number;
  };
  userStats: {
    newUsersToday: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
    retentionRate: number;
    averageSessionTime: number;
    topCountries: Array<{ country: string; users: number; percentage: number }>;
  };
  battleStats: {
    battlesToday: number;
    battlesThisWeek: number;
    battlesThisMonth: number;
    averageBattleDuration: number;
    completionRate: number;
    popularLanguages: Array<{ language: string; battles: number; percentage: number }>;
  };
  challengeStats: {
    challengesCreated: number;
    challengesCompleted: number;
    averageRating: number;
    difficultyDistribution: Array<{ difficulty: string; count: number; percentage: number }>;
  };
  performance: {
    avgResponseTime: number;
    uptime: number;
    errorRate: number;
    peakConcurrentUsers: number;
  };
}

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  // Mock data - in production, fetch from API
  useEffect(() => {
    const mockData: AnalyticsData = {
      overview: {
        totalUsers: 15247,
        activeUsers: 3428,
        totalBattles: 8932,
        totalChallenges: 342,
        userGrowth: 12.5,
        battleGrowth: 8.3,
        challengeGrowth: 15.7,
        engagementRate: 68.2
      },
      userStats: {
        newUsersToday: 45,
        newUsersThisWeek: 312,
        newUsersThisMonth: 1289,
        retentionRate: 72.4,
        averageSessionTime: 28.5,
        topCountries: [
          { country: 'United States', users: 4234, percentage: 27.8 },
          { country: 'India', users: 2845, percentage: 18.7 },
          { country: 'Germany', users: 1567, percentage: 10.3 },
          { country: 'Canada', users: 1234, percentage: 8.1 },
          { country: 'United Kingdom', users: 998, percentage: 6.5 }
        ]
      },
      battleStats: {
        battlesToday: 156,
        battlesThisWeek: 1089,
        battlesThisMonth: 4234,
        averageBattleDuration: 32.4,
        completionRate: 87.3,
        popularLanguages: [
          { language: 'JavaScript', battles: 3245, percentage: 36.3 },
          { language: 'Python', battles: 2834, percentage: 31.7 },
          { language: 'Java', battles: 1567, percentage: 17.5 },
          { language: 'C++', battles: 892, percentage: 10.0 },
          { language: 'TypeScript', battles: 394, percentage: 4.4 }
        ]
      },
      challengeStats: {
        challengesCreated: 47,
        challengesCompleted: 12847,
        averageRating: 4.2,
        difficultyDistribution: [
          { difficulty: 'Easy', count: 142, percentage: 41.5 },
          { difficulty: 'Medium', count: 134, percentage: 39.2 },
          { difficulty: 'Hard', count: 66, percentage: 19.3 }
        ]
      },
      performance: {
        avgResponseTime: 245,
        uptime: 99.97,
        errorRate: 0.12,
        peakConcurrentUsers: 1847
      }
    };

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  if (loading || !data) {
    return (
      <AdminLayout activeSection="analytics">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading analytics...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeSection="analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-gray-400 mt-1">Monitor platform performance and user engagement</p>
          </div>
          <div className="flex space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="1d">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{formatNumber(data.overview.totalUsers)}</p>
                <div className={`flex items-center mt-2 ${getGrowthColor(data.overview.userGrowth)}`}>
                  {getGrowthIcon(data.overview.userGrowth)}
                  <span className="ml-1 text-sm">{Math.abs(data.overview.userGrowth)}%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-white">{formatNumber(data.overview.activeUsers)}</p>
                <div className="flex items-center mt-2 text-green-400">
                  <Activity className="h-4 w-4" />
                  <span className="ml-1 text-sm">{data.overview.engagementRate}%</span>
                </div>
              </div>
              <Activity className="h-8 w-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Battles</p>
                <p className="text-2xl font-bold text-white">{formatNumber(data.overview.totalBattles)}</p>
                <div className={`flex items-center mt-2 ${getGrowthColor(data.overview.battleGrowth)}`}>
                  {getGrowthIcon(data.overview.battleGrowth)}
                  <span className="ml-1 text-sm">{Math.abs(data.overview.battleGrowth)}%</span>
                </div>
              </div>
              <Swords className="h-8 w-8 text-purple-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Challenges</p>
                <p className="text-2xl font-bold text-white">{data.overview.totalChallenges}</p>
                <div className={`flex items-center mt-2 ${getGrowthColor(data.overview.challengeGrowth)}`}>
                  {getGrowthIcon(data.overview.challengeGrowth)}
                  <span className="ml-1 text-sm">{Math.abs(data.overview.challengeGrowth)}%</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-yellow-400" />
            </div>
          </motion.div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Analytics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">User Analytics</h3>
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{data.userStats.newUsersToday}</div>
                  <div className="text-gray-400 text-sm">Today</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{data.userStats.newUsersThisWeek}</div>
                  <div className="text-gray-400 text-sm">This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{data.userStats.newUsersThisMonth}</div>
                  <div className="text-gray-400 text-sm">This Month</div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Retention Rate</span>
                  <span className="text-green-400 font-semibold">{data.userStats.retentionRate}%</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Avg Session Time</span>
                  <span className="text-white font-semibold">{data.userStats.averageSessionTime}m</span>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-white font-medium mb-3">Top Countries</h4>
                <div className="space-y-2">
                  {data.userStats.topCountries.map((country, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300">{country.country}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-white">{formatNumber(country.users)}</span>
                        <span className="text-gray-400 text-sm">({country.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Battle Analytics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Battle Analytics</h3>
              <Swords className="h-5 w-5 text-purple-400" />
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{data.battleStats.battlesToday}</div>
                  <div className="text-gray-400 text-sm">Today</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{data.battleStats.battlesThisWeek}</div>
                  <div className="text-gray-400 text-sm">This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{data.battleStats.battlesThisMonth}</div>
                  <div className="text-gray-400 text-sm">This Month</div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Avg Duration</span>
                  <span className="text-yellow-400 font-semibold">{data.battleStats.averageBattleDuration}m</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Completion Rate</span>
                  <span className="text-green-400 font-semibold">{data.battleStats.completionRate}%</span>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-white font-medium mb-3">Popular Languages</h4>
                <div className="space-y-2">
                  {data.battleStats.popularLanguages.map((lang, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300">{lang.language}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-white">{formatNumber(lang.battles)}</span>
                        <span className="text-gray-400 text-sm">({lang.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Challenge & Performance Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Challenge Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Challenge Analytics</h3>
              <Target className="h-5 w-5 text-yellow-400" />
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{data.challengeStats.challengesCreated}</div>
                  <div className="text-gray-400 text-sm">Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{formatNumber(data.challengeStats.challengesCompleted)}</div>
                  <div className="text-gray-400 text-sm">Completed</div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Average Rating</span>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-yellow-400 font-semibold">{data.challengeStats.averageRating}/5</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-white font-medium mb-3">Difficulty Distribution</h4>
                <div className="space-y-3">
                  {data.challengeStats.difficultyDistribution.map((diff, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300">{diff.difficulty}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-white">{diff.count}</span>
                        <span className="text-gray-400 text-sm">({diff.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">System Performance</h3>
              <BarChart3 className="h-5 w-5 text-green-400" />
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-gray-400 text-sm">Response Time</div>
                      <div className="text-xl font-bold text-white">{data.performance.avgResponseTime}ms</div>
                    </div>
                    <Clock className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-gray-400 text-sm">Uptime</div>
                      <div className="text-xl font-bold text-green-400">{data.performance.uptime}%</div>
                    </div>
                    <Zap className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-gray-400 text-sm">Error Rate</div>
                      <div className="text-xl font-bold text-red-400">{data.performance.errorRate}%</div>
                    </div>
                    <AlertTriangle className="h-6 w-6 text-red-400" />
                  </div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-gray-400 text-sm">Peak Users</div>
                      <div className="text-xl font-bold text-purple-400">{formatNumber(data.performance.peakConcurrentUsers)}</div>
                    </div>
                    <Users className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-white font-medium mb-3">System Health</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Database</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-green-400">Healthy</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">API Services</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-green-400">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Real-time Socket</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                      <span className="text-yellow-400">Warning</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
