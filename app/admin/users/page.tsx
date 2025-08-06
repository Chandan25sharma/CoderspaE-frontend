'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  UserCheck,
  Shield,
  Edit3,
  Trash2,
  Crown,
  Ban,
  Eye,
  Mail,
  MapPin,
  Activity,
  X
} from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'moderator' | 'admin';
  status: 'active' | 'banned' | 'suspended';
  createdAt: string;
  lastActive: string;
  stats: {
    level: number;
    xp: number;
    rank: number;
    battlesWon: number;
    battlesLost: number;
    totalBattles: number;
  };
  profile?: {
    location?: string;
    bio?: string;
  };
  verification: {
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
  };
  violations: number;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Mock data - in production, fetch from API
  useEffect(() => {
    const mockUsers: User[] = [
      {
        _id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'user',
        status: 'active',
        createdAt: '2024-01-15T10:30:00Z',
        lastActive: '2024-01-20T15:45:00Z',
        stats: {
          level: 5,
          xp: 2850,
          rank: 142,
          battlesWon: 23,
          battlesLost: 7,
          totalBattles: 30
        },
        profile: {
          location: 'New York, USA',
          bio: 'Full-stack developer passionate about algorithms'
        },
        verification: {
          isEmailVerified: true,
          isPhoneVerified: false
        },
        violations: 0
      },
      {
        _id: '2',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        role: 'moderator',
        status: 'active',
        createdAt: '2024-01-10T08:20:00Z',
        lastActive: '2024-01-20T16:30:00Z',
        stats: {
          level: 12,
          xp: 8450,
          rank: 28,
          battlesWon: 89,
          battlesLost: 12,
          totalBattles: 101
        },
        profile: {
          location: 'London, UK',
          bio: 'Competitive programmer and mentor'
        },
        verification: {
          isEmailVerified: true,
          isPhoneVerified: true
        },
        violations: 0
      },
      {
        _id: '3',
        name: 'Mike Chen',
        email: 'mike.chen@example.com',
        role: 'user',
        status: 'banned',
        createdAt: '2024-01-05T14:15:00Z',
        lastActive: '2024-01-18T12:00:00Z',
        stats: {
          level: 3,
          xp: 1200,
          rank: 850,
          battlesWon: 5,
          battlesLost: 15,
          totalBattles: 20
        },
        profile: {
          location: 'Toronto, Canada'
        },
        verification: {
          isEmailVerified: false,
          isPhoneVerified: false
        },
        violations: 3
      }
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUserAction = (action: string, userId: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => {
        if (user._id === userId) {
          switch (action) {
            case 'ban':
              return { ...user, status: 'banned' as const };
            case 'unban':
              return { ...user, status: 'active' as const };
            case 'suspend':
              return { ...user, status: 'suspended' as const };
            case 'promote':
              return { ...user, role: 'moderator' as const };
            case 'demote':
              return { ...user, role: 'user' as const };
            default:
              return user;
          }
        }
        return user;
      })
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4 text-yellow-400" />;
      case 'moderator':
        return <Shield className="h-4 w-4 text-blue-400" />;
      default:
        return <UserCheck className="h-4 w-4 text-green-400" />;
    }
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-400/10';
      case 'banned':
        return 'text-red-400 bg-red-400/10';
      case 'suspended':
        return 'text-yellow-400 bg-yellow-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <AdminLayout activeSection="users">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">User Management</h1>
            <p className="text-gray-400 mt-1">Manage users, roles, and permissions</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            Export Users
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="moderator">Moderators</option>
              <option value="admin">Admins</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
              <option value="suspended">Suspended</option>
            </select>

            {/* Advanced Filters */}
            <button className="flex items-center justify-center px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors">
              <Filter className="h-5 w-5 mr-2" />
              More Filters
            </button>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-green-400">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Moderators</p>
                <p className="text-2xl font-bold text-blue-400">
                  {users.filter(u => u.role === 'moderator').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Banned Users</p>
                <p className="text-2xl font-bold text-red-400">
                  {users.filter(u => u.status === 'banned').length}
                </p>
              </div>
              <Ban className="h-8 w-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-medium">{user.name}</div>
                            <div className="text-gray-400 text-sm">{user.email}</div>
                            {user.profile?.location && (
                              <div className="flex items-center text-gray-500 text-xs mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {user.profile.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {getRoleIcon(user.role)}
                          <span className="ml-2 text-white capitalize">{user.role}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-white">Level {user.stats.level}</div>
                          <div className="text-gray-400">Rank #{user.stats.rank}</div>
                          <div className="text-gray-500 text-xs">
                            {user.stats.battlesWon}W / {user.stats.battlesLost}L
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-white">{formatDate(user.createdAt)}</div>
                          <div className="text-gray-400 text-xs">
                            Last active: {formatDate(user.lastActive)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                            title="Edit User"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          {user.status === 'active' ? (
                            <button
                              onClick={() => handleUserAction('ban', user._id)}
                              className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                              title="Ban User"
                            >
                              <Ban className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUserAction('unban', user._id)}
                              className="p-1 text-gray-400 hover:text-green-400 transition-colors"
                              title="Unban User"
                            >
                              <UserCheck className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-gray-400 text-sm">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-gray-700 text-white rounded border border-gray-600 hover:bg-gray-600 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded">
              1
            </button>
            <button className="px-3 py-1 bg-gray-700 text-white rounded border border-gray-600 hover:bg-gray-600 transition-colors">
              2
            </button>
            <button className="px-3 py-1 bg-gray-700 text-white rounded border border-gray-600 hover:bg-gray-600 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">User Details</h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedUser.name}</h3>
                  <p className="text-gray-400">{selectedUser.email}</p>
                  <div className="flex items-center mt-1">
                    {getRoleIcon(selectedUser.role)}
                    <span className="ml-1 text-sm text-gray-300 capitalize">{selectedUser.role}</span>
                    <span className={`ml-3 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedUser.status)}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-400">{selectedUser.stats.level}</div>
                  <div className="text-gray-400 text-sm">Level</div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">#{selectedUser.stats.rank}</div>
                  <div className="text-gray-400 text-sm">Rank</div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-400">{selectedUser.stats.battlesWon}</div>
                  <div className="text-gray-400 text-sm">Wins</div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-red-400">{selectedUser.violations}</div>
                  <div className="text-gray-400 text-sm">Violations</div>
                </div>
              </div>

              {/* Profile Info */}
              {selectedUser.profile?.bio && (
                <div>
                  <h4 className="text-white font-medium mb-2">Bio</h4>
                  <p className="text-gray-300">{selectedUser.profile.bio}</p>
                </div>
              )}

              {/* Verification Status */}
              <div>
                <h4 className="text-white font-medium mb-2">Verification</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-300">Email: </span>
                    <span className={selectedUser.verification.isEmailVerified ? 'text-green-400' : 'text-red-400'}>
                      {selectedUser.verification.isEmailVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-300">Phone: </span>
                    <span className={selectedUser.verification.isPhoneVerified ? 'text-green-400' : 'text-red-400'}>
                      {selectedUser.verification.isPhoneVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-700">
                {selectedUser.role === 'user' && (
                  <button
                    onClick={() => {
                      handleUserAction('promote', selectedUser._id);
                      setShowUserModal(false);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Promote to Moderator
                  </button>
                )}
                {selectedUser.role === 'moderator' && (
                  <button
                    onClick={() => {
                      handleUserAction('demote', selectedUser._id);
                      setShowUserModal(false);
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Demote to User
                  </button>
                )}
                {selectedUser.status === 'active' ? (
                  <button
                    onClick={() => {
                      handleUserAction('ban', selectedUser._id);
                      setShowUserModal(false);
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Ban User
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleUserAction('unban', selectedUser._id);
                      setShowUserModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Unban User
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
};

export default UserManagement;
