'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Shield, Users, Trophy, Gamepad2,
  BarChart3, Settings, Plus, Edit3, Trash2, Search,
  Target, TrendingUp, UserCheck, Bell, LogOut
} from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface DashboardStats {
  totalUsers: number;
  totalPractices: number;
  totalTournaments: number;
  totalTeams: number;
  totalAnnouncements: number;
  totalAdvertisements: number;
  activeUsers: number;
  activeTournaments: number;
}

interface ContentItem {
  _id: string;
  title?: string;
  name?: string;
  description?: string;
  type?: string;
  status?: string;
  difficulty?: string;
  createdAt: string;
  createdBy?: {
    name: string;
    email: string;
  };
  captain?: {
    name: string;
    email: string;
  };
  isActive?: boolean;
  priority?: string;
}

interface AdminFormData {
  title?: string;
  name?: string;
  description?: string;
  difficulty?: string;
  language?: string;
  category?: string;
  timeLimit?: number;
  problemStatement?: string;
  starterCode?: string;
  solutionCode?: string;
  testCases?: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  hints?: string[];
  tags?: string[];
  points?: number;
  isActive?: boolean;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  registrationDeadline?: string;
  maxParticipants?: number;
  entryFee?: number;
  prizePool?: number;
  rules?: string[];
  challenges?: string[];
  format?: string;
  teamSize?: number;
  captain?: {
    name: string;
    email: string;
  };
  members?: Array<{
    name: string;
    email: string;
    role: string;
  }>;
  priority?: string;
  targetAudience?: string;
  expiryDate?: string;
  imageUrl?: string;
  actionUrl?: string;
  budget?: number;
  impressions?: number;
  clicks?: number;
  email?: string;
  role?: string;
  battlesWon?: number;
  battlesLost?: number;
  totalBattles?: number;
  rating?: number;
  preferredLanguage?: string;
  slug?: string;
  content?: string;
  advertiserName?: string;
  advertiser?: {
    name: string;
  };
  maxMembers?: number;
  settings?: {
    maxMembers?: number;
  };
  registrationStart?: string;
  registrationEnd?: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [contentData, setContentData] = useState<ContentItem[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const router = useRouter();

  useEffect(() => {
    checkAuthAndLoadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeTab !== 'overview' && activeTab !== 'admin-management') {
      loadContentData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const checkAuthAndLoadData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const adminUserData = localStorage.getItem('admin-user');
      
      if (!token || !adminUserData) {
        router.push('/admin/login');
        return;
      }

      try {
        const userData = JSON.parse(adminUserData);
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role
        });
        
        // Load dashboard stats
        await loadDashboardStats();
      } catch (parseError) {
        console.error('Failed to parse admin user data:', parseError);
        router.push('/admin/login');
        return;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/admin/data?type=dashboard&_t=${timestamp}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      } else {
        console.error('Failed to load dashboard stats:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    }
  };

  const loadContentData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/admin/data?type=${getApiType(activeTab)}&_t=${timestamp}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setContentData(Array.isArray(data) ? data : data.users || []);
      } else {
        console.error('Failed to load content data:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to load content data:', error);
    }
  };

  const getApiType = (tab: string) => {
    const typeMap: Record<string, string> = {
      'practices': 'practices',
      'tournaments': 'tournaments',
      'battle-modes': 'battle-modes',
      'teams': 'teams',
      'announcements': 'announcements',
      'advertisements': 'advertisements',
      'users': 'users'
    };
    return typeMap[tab] || tab;
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin-user');
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout even if API call fails
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin-user');
      router.push('/admin/login');
    }
  };

interface AdminFormData {
  title?: string;
  name?: string;
  description?: string;
  difficulty?: string;
  language?: string;
  category?: string;
  timeLimit?: number;
  problemStatement?: string;
  starterCode?: string;
  solutionCode?: string;
  testCases?: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  hints?: string[];
  tags?: string[];
  points?: number;
  isActive?: boolean;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  registrationDeadline?: string;
  maxParticipants?: number;
  entryFee?: number;
  prizePool?: number;
  rules?: string[];
  challenges?: string[];
  format?: string;
  teamSize?: number;
  captain?: {
    name: string;
    email: string;
  };
  members?: Array<{
    name: string;
    email: string;
    role: string;
  }>;
  priority?: string;
  targetAudience?: string;
  expiryDate?: string;
  imageUrl?: string;
  actionUrl?: string;
  budget?: number;
  impressions?: number;
  clicks?: number;
  email?: string;
  role?: string;
  battlesWon?: number;
  battlesLost?: number;
  totalBattles?: number;
  rating?: number;
  preferredLanguage?: string;
}

  const handleCreate = async (formData: AdminFormData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/data?type=${getApiType(activeTab)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Force reload content data and dashboard stats
        await Promise.all([
          loadContentData(),
          loadDashboardStats()
        ]);
        setShowCreateModal(false);
        
        // Show success message
        const successMessage = `${getApiType(activeTab).slice(0, -1)} created successfully!`;
        alert(successMessage);
      } else {
        const error = await response.json();
        console.error('Create error:', error);
        alert(`Error: ${error.error || 'Failed to create item'}`);
      }
    } catch (error) {
      console.error('Create failed:', error);
      alert('Failed to create item. Please try again.');
    }
  };

  const handleEdit = async (formData: AdminFormData) => {
    if (!selectedItem) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/data?type=${getApiType(activeTab)}&id=${selectedItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Force reload content data and dashboard stats
        await Promise.all([
          loadContentData(),
          loadDashboardStats()
        ]);
        setShowEditModal(false);
        setSelectedItem(null);
        
        // Show success message
        const successMessage = `${getApiType(activeTab).slice(0, -1)} updated successfully!`;
        alert(successMessage);
      } else {
        const error = await response.json();
        console.error('Edit error:', error);
        alert(`Error: ${error.error || 'Failed to update item'}`);
      }
    } catch (error) {
      console.error('Edit failed:', error);
      alert('Failed to update item. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/data?type=${getApiType(activeTab)}&id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Force reload content data and dashboard stats
        await Promise.all([
          loadContentData(),
          loadDashboardStats()
        ]);
        
        // Show success message
        const successMessage = `${getApiType(activeTab).slice(0, -1)} deleted successfully!`;
        alert(successMessage);
      } else {
        const error = await response.json();
        console.error('Delete error:', error);
        alert(`Error: ${error.error || 'Failed to delete item'}`);
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete item. Please try again.');
    }
  };

  const filteredData = contentData.filter(item => {
    const matchesSearch = (item.title || item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         item.status?.toLowerCase() === filterStatus ||
                         (filterStatus === 'active' && item.isActive) ||
                         (filterStatus === 'inactive' && !item.isActive);
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string | boolean | undefined) => {
    if (typeof status === 'boolean') {
      return status ? 'bg-green-500' : 'bg-red-500';
    }
    
    switch (status?.toLowerCase()) {
      case 'active':
      case 'published':
      case 'approved':
        return 'bg-green-500';
      case 'draft':
      case 'pending':
        return 'bg-yellow-500';
      case 'inactive':
      case 'cancelled':
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'practices', name: 'Practice Challenges', icon: Target },
    { id: 'tournaments', name: 'Tournaments', icon: Trophy },
    { id: 'battle-modes', name: 'Battle Modes', icon: Gamepad2 },
    { id: 'live-battles', name: 'Live Battles', icon: Shield },
    { id: 'teams', name: 'Teams', icon: Users },
    { id: 'announcements', name: 'Announcements', icon: Bell },
    { id: 'advertisements', name: 'Advertisements', icon: TrendingUp },
    { id: 'users', name: 'User Management', icon: UserCheck },
    { id: 'activity-log', name: 'Activity Log', icon: Shield },
    ...(user?.role === 'super-admin' ? [{ id: 'admin-management', name: 'Admin Management', icon: Settings }] : [])
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-purple-900 to-cyber-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-purple-900 to-cyber-dark">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className="h-8 w-8 text-neon-blue" />
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400">Manage users, tournaments, and system performance for CoderspaE</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-white font-medium">{user?.name}</div>
              <div className="text-neon-blue text-sm">{user?.role}</div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900/30 border-r border-gray-700 min-h-screen">
          <nav className="p-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-neon-blue text-cyber-dark font-medium'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-white mb-6">Dashboard Overview</h2>
              
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Total Users</p>
                        <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
                      </div>
                      <Users className="h-8 w-8 text-neon-blue" />
                    </div>
                    <p className="text-green-400 text-sm mt-2">
                      {stats.activeUsers} active this month
                    </p>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Tournaments</p>
                        <p className="text-2xl font-bold text-white">{stats.totalTournaments}</p>
                      </div>
                      <Trophy className="h-8 w-8 text-neon-purple" />
                    </div>
                    <p className="text-yellow-400 text-sm mt-2">
                      {stats.activeTournaments} in progress
                    </p>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Practice Challenges</p>
                        <p className="text-2xl font-bold text-white">{stats.totalPractices}</p>
                      </div>
                      <Target className="h-8 w-8 text-green-400" />
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Teams</p>
                        <p className="text-2xl font-bold text-white">{stats.totalTeams}</p>
                      </div>
                      <Users className="h-8 w-8 text-orange-400" />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab !== 'overview' && activeTab !== 'admin-management' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Content Management Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">
                  {tabs.find(tab => tab.id === activeTab)?.name}
                </h2>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-neon-blue hover:bg-blue-600 text-cyber-dark px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Create New
                </button>
              </div>

              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-neon-blue"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-neon-blue"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* Content Table */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          {activeTab === 'teams' ? 'Name' : 'Title'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Type/Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Created By
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Created Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {filteredData.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-white font-medium">
                              {item.title || item.name || 'Untitled'}
                            </div>
                            {item.description && (
                              <div className="text-gray-400 text-sm truncate max-w-xs">
                                {item.description}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(item.status || item.isActive)}`}>
                              {item.status || item.type || item.difficulty || (item.isActive ? 'Active' : 'Inactive')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                            {item.createdBy?.name || item.captain?.name || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedItem(item);
                                  setShowEditModal(true);
                                }}
                                className="text-neon-blue hover:text-blue-400 p-1"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="text-red-400 hover:text-red-300 p-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredData.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    No items found. Create your first {activeTab} to get started!
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'activity-log' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">Admin Activity Log</h2>
                <div className="flex gap-3">
                  <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                    <option value="">All Actions</option>
                    <option value="USER_CREATED">User Actions</option>
                    <option value="CHALLENGE_CREATED">Challenge Actions</option>
                    <option value="BATTLE_CREATED">Battle Actions</option>
                    <option value="SYSTEM_MAINTENANCE">System Actions</option>
                  </select>
                  <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                    <option value="">All Severity</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Admin</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Action</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Target</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Severity</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Timestamp</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">IP Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      <tr className="hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-white">Chandan Sharma</div>
                            <div className="text-sm text-gray-400">chandan@coderspae.com</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-white">USER_SUSPENDED</td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-white">user</div>
                            <div className="text-sm text-gray-400">SpeedCoder (john@example.com)</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400">
                            HIGH
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-300">2024-08-03 14:30:22</td>
                        <td className="px-6 py-4 text-gray-300">192.168.1.100</td>
                      </tr>
                      <tr className="hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-white">Chandan Sharma</div>
                            <div className="text-sm text-gray-400">chandan@coderspae.com</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-white">CHALLENGE_CREATED</td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-white">challenge</div>
                            <div className="text-sm text-gray-400">Two Sum Advanced</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">
                            MEDIUM
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-300">2024-08-03 13:15:10</td>
                        <td className="px-6 py-4 text-gray-300">192.168.1.100</td>
                      </tr>
                      <tr className="hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-white">System</div>
                            <div className="text-sm text-gray-400">auto@system.com</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-white">USER_LOGIN</td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-white">user</div>
                            <div className="text-sm text-gray-400">jane@example.com</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                            LOW
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-300">2024-08-03 12:45:33</td>
                        <td className="px-6 py-4 text-gray-300">10.0.0.50</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-gray-400 text-sm">
                  Showing 1-3 of 1,247 activities
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50" disabled>
                    Previous
                  </button>
                  <button className="px-3 py-1 bg-neon-blue text-cyber-dark rounded hover:bg-blue-600 font-medium">
                    Next
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'live-battles' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">Live Battles Management</h2>
                <div className="flex gap-3">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Live Battle
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium">
                    Emergency Stop All
                  </button>
                </div>
              </div>

              {/* Live Battles Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Battles</p>
                      <p className="text-2xl font-bold text-green-400">7</p>
                    </div>
                    <Shield className="h-8 w-8 text-green-400" />
                  </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Live Viewers</p>
                      <p className="text-2xl font-bold text-blue-400">1,234</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-400" />
                  </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Streaming Battles</p>
                      <p className="text-2xl font-bold text-purple-400">3</p>
                    </div>
                    <Trophy className="h-8 w-8 text-purple-400" />
                  </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Today</p>
                      <p className="text-2xl font-bold text-yellow-400">42</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-yellow-400" />
                  </div>
                </div>
              </div>

              {/* Active Battles Table */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-white">Active Live Battles</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Battle ID</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Challenge</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Participants</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Viewers</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Time Left</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      <tr className="hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div className="text-white font-mono text-sm">live_123456</div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-white">Binary Tree Traversal</div>
                            <div className="text-sm text-gray-400">Hard</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex -space-x-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                              A
                            </div>
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                              B
                            </div>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">Alice vs Bob</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                            ACTIVE
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white">847</td>
                        <td className="px-6 py-4 text-white font-mono">23:45</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700" title="View Battle">
                              👁️
                            </button>
                            <button className="p-1 bg-red-600 text-white rounded hover:bg-red-700" title="End Battle">
                              ⏹️
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div className="text-white font-mono text-sm">live_789012</div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-white">Two Sum Advanced</div>
                            <div className="text-sm text-gray-400">Medium</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex -space-x-2">
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                              C
                            </div>
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                              D
                            </div>
                            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                              E
                            </div>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">3-way battle</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400">
                            STREAMING
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white">2,341</td>
                        <td className="px-6 py-4 text-white font-mono">15:22</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700" title="View Battle">
                              👁️
                            </button>
                            <button className="p-1 bg-purple-600 text-white rounded hover:bg-purple-700" title="YouTube">
                              📺
                            </button>
                            <button className="p-1 bg-red-600 text-white rounded hover:bg-red-700" title="End Battle">
                              ⏹️
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Battles */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-white">Recent Completed Battles</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <div>
                          <div className="text-white font-medium">Fibonacci Sequence</div>
                          <div className="text-sm text-gray-400">Winner: SpeedCoder | Duration: 18:45</div>
                        </div>
                      </div>
                      <div className="text-gray-400 text-sm">2 hours ago</div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <div>
                          <div className="text-white font-medium">Graph Algorithms</div>
                          <div className="text-sm text-gray-400">Cancelled by admin | Reason: Technical issues</div>
                        </div>
                      </div>
                      <div className="text-gray-400 text-sm">4 hours ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'admin-management' && user?.role === 'super-admin' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">Admin Management</h2>
                <button className="bg-neon-blue hover:bg-blue-600 text-cyber-dark px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Admin
                </button>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <p className="text-gray-300 mb-4">Manage admin users and their permissions. Only Super Admins can access this section.</p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div>
                      <div className="text-white font-medium">Chandan Sharma</div>
                      <div className="text-gray-400 text-sm">chandan@coderspae.com</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-full">Super Admin</span>
                      <button className="text-neon-blue hover:text-blue-400">
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Create/Edit Modals */}
      {showCreateModal && (
        <CreateModal
          type={activeTab}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
        />
      )}

      {showEditModal && selectedItem && (
        <EditModal
          type={activeTab}
          item={selectedItem}
          onClose={() => {
            setShowEditModal(false);
            setSelectedItem(null);
          }}
          onSubmit={handleEdit}
        />
      )}
    </div>
  );
}

// Create Modal Component
function CreateModal({ type, onClose, onSubmit }: { type: string; onClose: () => void; onSubmit: (data: AdminFormData) => void }) {
  const [formData, setFormData] = useState<AdminFormData>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderForm = () => {
    switch (type) {
      case 'practices':
        return (
          <>
            <input
              type="text"
              placeholder="Challenge Title *"
              value={formData.title || ''}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
            <textarea
              placeholder="Problem Description *"
              value={formData.description || ''}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-24"
              required
            />
            <textarea
              placeholder="Problem Statement *"
              value={formData.problemStatement || ''}
              onChange={(e) => setFormData({...formData, problemStatement: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-32"
              required
            />
            <select
              value={formData.difficulty || ''}
              onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            >
              <option value="">Select Difficulty *</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
            <input
              type="text"
              placeholder="Programming Language *"
              value={formData.language || ''}
              onChange={(e) => setFormData({...formData, language: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
            <input
              type="text"
              placeholder="Category *"
              value={formData.category || ''}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
            <input
              type="number"
              placeholder="Time Limit (minutes) *"
              value={formData.timeLimit || ''}
              onChange={(e) => setFormData({...formData, timeLimit: parseInt(e.target.value)})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
          </>
        );

      case 'tournaments':
        return (
          <>
            <input
              type="text"
              placeholder="Tournament Title *"
              value={formData.title || ''}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
            <textarea
              placeholder="Tournament Description *"
              value={formData.description || ''}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-24"
              required
            />
            <select
              value={formData.type || ''}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            >
              <option value="">Select Type *</option>
              <option value="Single Elimination">Single Elimination</option>
              <option value="Double Elimination">Double Elimination</option>
              <option value="Round Robin">Round Robin</option>
              <option value="Swiss System">Swiss System</option>
            </select>
            <select
              value={formData.format || ''}
              onChange={(e) => setFormData({...formData, format: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            >
              <option value="">Select Format *</option>
              <option value="1v1">1v1</option>
              <option value="Team">Team</option>
              <option value="Free for All">Free for All</option>
            </select>
            <input
              type="number"
              placeholder="Max Participants *"
              value={formData.maxParticipants || ''}
              onChange={(e) => setFormData({...formData, maxParticipants: parseInt(e.target.value)})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
            <input
              type="datetime-local"
              placeholder="Registration Start *"
              value={formData.registrationStart || ''}
              onChange={(e) => setFormData({...formData, registrationStart: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
            <input
              type="datetime-local"
              placeholder="Registration End *"
              value={formData.registrationEnd || ''}
              onChange={(e) => setFormData({...formData, registrationEnd: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
          </>
        );

      case 'battle-modes':
        return (
          <>
            <input
              type="text"
              placeholder="Battle Mode Name *"
              value={formData.name || ''}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
            <input
              type="text"
              placeholder="Slug (URL-friendly name) *"
              value={formData.slug || ''}
              onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
            <textarea
              placeholder="Description *"
              value={formData.description || ''}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-24"
              required
            />
            <select
              value={formData.type || ''}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            >
              <option value="">Select Battle Mode Type *</option>
              <option value="Mirror Arena">Mirror Arena</option>
              <option value="Minimalist Mind">Minimalist Mind</option>
              <option value="Code Arena">Code Arena</option>
              <option value="Attack & Defend">Attack & Defend</option>
              <option value="Narrative Mode">Narrative Mode</option>
              <option value="Live Viewer">Live Viewer</option>
            </select>
            <select
              value={formData.difficulty || ''}
              onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            >
              <option value="">Select Difficulty *</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </>
        );

      case 'announcements':
        return (
          <>
            <input
              type="text"
              placeholder="Announcement Title *"
              value={formData.title || ''}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
            <textarea
              placeholder="Announcement Content *"
              value={formData.content || ''}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-32"
              required
            />
            <select
              value={formData.type || ''}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            >
              <option value="">Select Type *</option>
              <option value="General">General</option>
              <option value="Tournament">Tournament</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Feature">Feature</option>
              <option value="Emergency">Emergency</option>
            </select>
            <select
              value={formData.priority || ''}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            >
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </>
        );

      case 'advertisements':
        return (
          <>
            <input
              type="text"
              placeholder="Advertisement Title *"
              value={formData.title || ''}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
            <textarea
              placeholder="Description *"
              value={formData.description || ''}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-24"
              required
            />
            <select
              value={formData.type || ''}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            >
              <option value="">Select Ad Type *</option>
              <option value="Banner">Banner</option>
              <option value="Sidebar">Sidebar</option>
              <option value="Popup">Popup</option>
              <option value="Native">Native</option>
              <option value="Video">Video</option>
              <option value="Sponsored Content">Sponsored Content</option>
            </select>
            <input
              type="text"
              placeholder="Advertiser Name *"
              value={formData.advertiserName || ''}
              onChange={(e) => setFormData({...formData, advertiser: { name: e.target.value }})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
          </>
        );

      case 'teams':
        return (
          <>
            <input
              type="text"
              placeholder="Team Name *"
              value={formData.name || ''}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
            <textarea
              placeholder="Team Description *"
              value={formData.description || ''}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-24"
              required
            />
            <input
              type="number"
              placeholder="Max Members"
              value={formData.maxMembers || ''}
              onChange={(e) => setFormData({...formData, settings: { ...formData.settings, maxMembers: parseInt(e.target.value) }})}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </>
        );

      default:
        return (
          <input
            type="text"
            placeholder="Title *"
            value={formData.title || formData.name || ''}
            onChange={(e) => setFormData({...formData, title: e.target.value, name: e.target.value})}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            required
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-white mb-4">
          Create New {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderForm()}
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-neon-blue text-cyber-dark rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Modal Component
function EditModal({ type, item, onClose, onSubmit }: { type: string; item: ContentItem; onClose: () => void; onSubmit: (data: AdminFormData) => void }) {
  const [formData, setFormData] = useState<AdminFormData>({
    title: item.title || item.name || '',
    description: item.description || '',
    type: item.type || '',
    status: item.status || '',
    difficulty: item.difficulty || '',
    isActive: item.isActive !== undefined ? item.isActive : true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">
          Edit {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            required
          />
          
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-24"
          />
          
          <div className="flex items-center gap-3">
            <label className="text-white">Active:</label>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              className="w-4 h-4"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-neon-blue text-cyber-dark rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
