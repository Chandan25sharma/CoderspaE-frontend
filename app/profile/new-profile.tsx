'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { 
  User, Trophy, Star, Calendar, Target, Activity, BarChart3, 
  Zap, Edit3, Settings, MapPin, Link as LinkIcon, Save, 
  Eye, EyeOff, Camera, Shield, Globe
} from 'lucide-react';
import { AnimatedBadge } from '../../components/AnimatedBadge';
import { XPProgressBar } from '../../components/XPProgressBar';
import { ConfettiCelebration } from '../../components/ConfettiCelebration';
import Image from 'next/image';

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  location?: string;
  website?: string;
  githubUsername?: string;
  twitterHandle?: string;
  linkedinProfile?: string;
  preferredLanguages: string[];
  timezone: string;
  isPublicProfile: boolean;
  emailNotifications: boolean;
  level: number;
  xp: number;
  nextLevelXP: number;
  rank: number;
  battlesWon: number;
  battlesPlayed: number;
  challengesCompleted: number;
  joinDate: string;
}

interface EditableProfileProps {
  profile: UserProfile;
  onSave: (updatedProfile: Partial<UserProfile>) => void;
  onCancel: () => void;
}

const EditableProfile: React.FC<EditableProfileProps> = ({ profile, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>(profile);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (newPassword && newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      const updateData = { ...formData };
      if (newPassword) {
        updateData.password = newPassword;
      }

      await onSave(updateData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Edit3 className="w-6 h-6 mr-2 text-blue-400" />
          Edit Profile
        </h2>
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Avatar */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                {formData.avatar ? (
                  <Image src={formData.avatar} alt="Avatar" width={96} height={96} className="rounded-full" />
                ) : (
                  formData.username?.[0]?.toUpperCase() || 'U'
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-2">Click to upload new avatar</p>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <input
              type="text"
              value={formData.username || ''}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
              placeholder="Enter username"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
              placeholder="Enter email"
            />
          </div>

          {/* Password */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Shield className="w-5 h-5 mr-2 text-red-400" />
              Change Password
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400 pr-12"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
            <textarea
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                placeholder="Your location"
              />
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={formData.website || ''}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                placeholder="https://your-website.com"
              />
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Settings className="w-5 h-5 mr-2 text-gray-400" />
              Settings
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-gray-300">Public Profile</span>
                <input
                  type="checkbox"
                  checked={formData.isPublicProfile || false}
                  onChange={(e) => setFormData({ ...formData, isPublicProfile: e.target.checked })}
                  className="rounded"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-gray-300">Email Notifications</span>
                <input
                  type="checkbox"
                  checked={formData.emailNotifications || false}
                  onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
                  className="rounded"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const mockProfile: UserProfile = {
          _id: '1',
          username: session?.user?.name || 'CodeMaster',
          email: session?.user?.email || 'user@coderspae.com',
          avatar: session?.user?.image || undefined,
          firstName: '',
          lastName: '',
          bio: 'Passionate developer with expertise in full-stack development.',
          location: 'San Francisco, CA',
          website: 'https://codemaster.dev',
          githubUsername: 'codemaster',
          twitterHandle: '@codemaster',
          linkedinProfile: 'codemaster-pro',
          preferredLanguages: ['JavaScript', 'Python', 'TypeScript'],
          timezone: 'UTC-8',
          isPublicProfile: true,
          emailNotifications: true,
          level: 42,
          xp: 15750,
          nextLevelXP: 18000,
          rank: 157,
          battlesWon: 87,
          battlesPlayed: 119,
          challengesCompleted: 234,
          joinDate: '2024-01-15'
        };
        setProfile(mockProfile);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [session]);

  const handleSave = async (updatedProfile: Partial<UserProfile>) => {
    try {
      console.log('Saving profile:', updatedProfile);
      setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
      setIsEditing(false);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'activity', label: 'Recent Activity', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!session || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300 text-lg mb-4">Please sign in to view your profile</p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
      {showConfetti && <ConfettiCelebration />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                  {profile.avatar ? (
                    <Image src={profile.avatar} alt="Avatar" width={96} height={96} className="rounded-full" />
                  ) : (
                    profile.username[0]?.toUpperCase()
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2">
                  <AnimatedBadge level={profile.level} />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{profile.username}</h1>
                <p className="text-gray-400 mb-3">{profile.bio}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  {profile.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Joined {new Date(profile.joinDate).toLocaleDateString()}</span>
                  </div>
                  {profile.website && (
                    <a href={profile.website} className="flex items-center text-blue-400 hover:underline">
                      <LinkIcon className="w-4 h-4 mr-1" />
                      <span>{profile.website}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </motion.div>

        {/* Edit Profile */}
        {isEditing && (
          <EditableProfile
            profile={profile}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        )}

        {/* Stats Cards */}
        {!isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-400">Current Level</div>
                  <div className="text-3xl font-bold text-yellow-400">{profile.level}</div>
                </div>
                <Star className="w-8 h-8 text-yellow-400" />
              </div>
              <XPProgressBar currentXP={profile.xp} nextLevelXP={profile.nextLevelXP} />
              <div className="text-xs text-gray-400 mt-2">
                {profile.nextLevelXP - profile.xp} XP to next level
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400">Global Rank</div>
                  <div className="text-3xl font-bold text-blue-400">#{profile.rank}</div>
                  <div className="text-xs text-green-400">Top 5%</div>
                </div>
                <Trophy className="w-8 h-8 text-blue-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400">Battles Won</div>
                  <div className="text-3xl font-bold text-green-400">{profile.battlesWon}</div>
                  <div className="text-xs text-gray-400">
                    {Math.round((profile.battlesWon / profile.battlesPlayed) * 100)}% win rate
                  </div>
                </div>
                <Zap className="w-8 h-8 text-green-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400">Challenges Solved</div>
                  <div className="text-3xl font-bold text-purple-400">{profile.challengesCompleted}</div>
                  <div className="text-xs text-green-400">95.2% accuracy</div>
                </div>
                <Target className="w-8 h-8 text-purple-400" />
              </div>
            </motion.div>
          </div>
        )}

        {/* Tab Navigation */}
        {!isEditing && (
          <div className="flex space-x-1 mb-8 bg-gray-800/50 p-2 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Tab Content */}
        {!isEditing && activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { type: 'battle', title: 'Won battle against @SpeedCoder', time: '2 hours ago', icon: '⚔️' },
                  { type: 'achievement', title: 'Earned "Algorithm Master" badge', time: '1 day ago', icon: '🏆' },
                  { type: 'challenge', title: 'Completed "Binary Tree Traversal"', time: '2 days ago', icon: '💡' },
                  { type: 'tournament', title: 'Joined "Weekly Championship"', time: '3 days ago', icon: '🎯' }
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-900/50 rounded-lg">
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-white">{activity.title}</p>
                      <p className="text-sm text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferred Languages */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Preferred Languages</h3>
              <div className="space-y-3">
                {profile.preferredLanguages.map((lang, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <span className="text-white">{lang}</span>
                    <div className="w-16 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-400 h-2 rounded-full" 
                        style={{ width: `${85 - idx * 15}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
