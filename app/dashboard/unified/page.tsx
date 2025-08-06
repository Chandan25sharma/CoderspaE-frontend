'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Trophy, Star, Target, Activity, 
  Zap, Edit3, MapPin, Link as LinkIcon, Save, X, Loader2,
  Swords, Brain, Users, Settings
} from 'lucide-react';
import { XPProgressBar } from '../../../components/XPProgressBar';
import { userApi } from '../../../lib/api';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  image?: string;
  profile: {
    bio?: string;
    location?: string;
    website?: string;
    socialLinks: {
      github?: string;
      twitter?: string;
      linkedin?: string;
    };
    title?: string;
  };
  stats: {
    level: number;
    xp: number;
    rank: number;
    battlesWon: number;
    battlesLost: number;
    totalBattles: number;
    longestStreak: number;
    currentStreak: number;
    averageAccuracy: number;
    averageWPM: number;
    totalChallengesCompleted: number;
    favoriteLanguage: string;
  };
  recentActivity: Array<{
    type: 'battle' | 'challenge' | 'achievement' | 'tournament';
    title: string;
    description: string;
    timestamp: string;
    result?: 'win' | 'loss' | 'draw';
    points?: number;
  }>;
  achievements: string[];
  joinedAt: string;
}

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'battles' | 'practice'>('overview');
  
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    location: '',
    website: '',
    github: '',
    twitter: '',
    linkedin: '',
    title: ''
  });

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {      
      try {
        setLoading(true);
        const response = await userApi.getMyProfile();
        setUser(response.user);
        
        // Initialize edit form
        setEditForm({
          name: response.user.name || '',
          bio: response.user.profile?.bio || '',
          location: response.user.profile?.location || '',
          website: response.user.profile?.website || '',
          github: response.user.profile?.socialLinks?.github || '',
          twitter: response.user.profile?.socialLinks?.twitter || '',
          linkedin: response.user.profile?.socialLinks?.linkedin || '',
          title: response.user.profile?.title || ''
        });
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchProfile();
    }
  }, [session]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const updateData = {
        name: editForm.name,
        profile: {
          bio: editForm.bio,
          location: editForm.location,
          website: editForm.website,
          socialLinks: {
            github: editForm.github,
            twitter: editForm.twitter,
            linkedin: editForm.linkedin,
          },
          title: editForm.title,
        }
      };

      const response = await userApi.updateProfile(updateData);
      setUser(response.user);
      setIsEditing(false);
      
      // Show success message
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateWinRate = () => {
    if (!user || user.stats.totalBattles === 0) return 0;
    return Math.round((user.stats.battlesWon / user.stats.totalBattles) * 100);
  };

  const calculateNextLevelXP = () => {
    if (!user) return 1000;
    return user.stats.level * 1000; // Each level requires level * 1000 XP
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
          <p className="text-gray-300 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">{error || 'Profile not found'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: Target },
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'battles', label: 'Battles', icon: Swords },
            { id: 'practice', label: 'Practice', icon: Brain }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'profile' | 'battles' | 'practice')}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-6">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="h-8 w-8" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
                    <p className="text-blue-100 mt-1">{user.profile?.title || 'Ready to code?'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">Level {user.stats.level}</div>
                  <div className="text-blue-100">Rank #{user.stats.rank}</div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onClick={() => router.push('/battle/real-time')}
                className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-xl text-white hover:scale-105 transition-transform"
              >
                <Swords className="h-8 w-8 mb-4" />
                <h3 className="text-lg font-bold">Start Battle</h3>
                <p className="text-red-100 text-sm">Challenge other coders</p>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => router.push('/practice')}
                className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white hover:scale-105 transition-transform"
              >
                <Brain className="h-8 w-8 mb-4" />
                <h3 className="text-lg font-bold">Practice</h3>
                <p className="text-green-100 text-sm">Solve challenges</p>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => router.push('/leaderboard')}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-xl text-white hover:scale-105 transition-transform"
              >
                <Trophy className="h-8 w-8 mb-4" />
                <h3 className="text-lg font-bold">Leaderboard</h3>
                <p className="text-yellow-100 text-sm">Check rankings</p>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => router.push('/teams')}
                className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white hover:scale-105 transition-transform"
              >
                <Users className="h-8 w-8 mb-4" />
                <h3 className="text-lg font-bold">Teams</h3>
                <p className="text-purple-100 text-sm">Join or create teams</p>
              </motion.button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Level & XP */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Current Level</h3>
                  <Star className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">LVL {user.stats.level}</div>
                <div className="text-sm text-gray-400 mb-3">
                  {user.stats.xp.toLocaleString()} / {calculateNextLevelXP().toLocaleString()} XP
                </div>
                <XPProgressBar 
                  currentXP={user.stats.xp} 
                  nextLevelXP={calculateNextLevelXP()}
                  level={user.stats.level}
                />
              </motion.div>

              {/* Global Rank */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Global Rank</h3>
                  <Trophy className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">#{user.stats.rank}</div>
                <div className="text-sm text-gray-400">Top performer</div>
              </motion.div>

              {/* Battles Won */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Battles Won</h3>
                  <Zap className="h-6 w-6 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-green-400 mb-2">{user.stats.battlesWon}</div>
                <div className="text-sm text-gray-400">
                  {calculateWinRate()}% win rate
                </div>
              </motion.div>

              {/* Challenges Solved */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Challenges Solved</h3>
                  <Target className="h-6 w-6 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-purple-400 mb-2">{user.stats.totalChallengesCompleted}</div>
                <div className="text-sm text-gray-400">
                  {user.stats.averageAccuracy}% accuracy
                </div>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Activity className="h-6 w-6 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
              </div>

              {user.recentActivity && user.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {user.recentActivity.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.result === 'win' ? 'bg-green-400' : 
                        activity.result === 'loss' ? 'bg-red-400' : 'bg-blue-400'
                      }`} />
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{activity.title}</h4>
                        <p className="text-gray-400 text-sm">{activity.description}</p>
                        <p className="text-gray-500 text-xs">
                          {formatDate(activity.timestamp)}
                        </p>
                      </div>
                      {activity.points && (
                        <div className="text-right">
                          <div className="text-yellow-400 font-bold">+{activity.points} XP</div>
                          <div className="text-gray-500 text-xs">{activity.result}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <h4 className="text-gray-400 font-medium mb-1">No Recent Activity</h4>
                  <p className="text-gray-500 text-sm">Start coding to see your activity here!</p>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
                {/* Avatar and Basic Info */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1">
                      <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                        {user.image ? (
                          <img src={user.image} alt={user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <User className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-800 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{user.stats.level}</span>
                    </div>
                  </div>

                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="text-2xl font-bold bg-gray-700 text-white px-3 py-1 rounded mb-2 w-full"
                        placeholder="Your name"
                      />
                    ) : (
                      <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                    )}
                    
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="bg-gray-700 text-blue-400 px-3 py-1 rounded w-full"
                        placeholder="Your title"
                      />
                    ) : (
                      <p className="text-blue-400 font-medium">{user.profile?.title || 'New Coder'}</p>
                    )}
                    
                    <p className="text-gray-400 mt-1">{user.email}</p>
                    <p className="text-gray-500 text-sm">Joined {formatDate(user.joinedAt)}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 lg:ml-auto">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Bio Section */}
              <div className="mt-6">
                {isEditing ? (
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="w-full bg-gray-700 text-gray-300 px-4 py-3 rounded-lg resize-none"
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-300 leading-relaxed">
                    {user.profile?.bio || 'No bio provided yet. Click edit to add one!'}
                  </p>
                )}
              </div>

              {/* Contact Info */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Location */}
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="bg-gray-700 text-gray-300 px-3 py-1 rounded w-full"
                      placeholder="Your location"
                    />
                  ) : (
                    <span className="text-gray-300">{user.profile?.location || 'Location not set'}</span>
                  )}
                </div>

                {/* Website */}
                <div className="flex items-center gap-3">
                  <LinkIcon className="h-5 w-5 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="url"
                      value={editForm.website}
                      onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                      className="bg-gray-700 text-gray-300 px-3 py-1 rounded w-full"
                      placeholder="Your website"
                    />
                  ) : (
                    <a 
                      href={user.profile?.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {user.profile?.website || 'No website set'}
                    </a>
                  )}
                </div>

                {/* Global Rank */}
                <div className="flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  <span className="text-gray-300">
                    Rank #{user.stats.rank.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* GitHub */}
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">GitHub:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.github}
                        onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                        className="bg-gray-700 text-gray-300 px-3 py-1 rounded flex-1"
                        placeholder="GitHub username"
                      />
                    ) : (
                      <span className="text-blue-400">
                        {user.profile?.socialLinks?.github ? `@${user.profile.socialLinks.github}` : 'Not set'}
                      </span>
                    )}
                  </div>

                  {/* Twitter */}
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">Twitter:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.twitter}
                        onChange={(e) => setEditForm({ ...editForm, twitter: e.target.value })}
                        className="bg-gray-700 text-gray-300 px-3 py-1 rounded flex-1"
                        placeholder="Twitter username"
                      />
                    ) : (
                      <span className="text-blue-400">
                        {user.profile?.socialLinks?.twitter ? `@${user.profile.socialLinks.twitter}` : 'Not set'}
                      </span>
                    )}
                  </div>

                  {/* LinkedIn */}
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">LinkedIn:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.linkedin}
                        onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                        className="bg-gray-700 text-gray-300 px-3 py-1 rounded flex-1"
                        placeholder="LinkedIn username"
                      />
                    ) : (
                      <span className="text-blue-400">
                        {user.profile?.socialLinks?.linkedin ? `@${user.profile.socialLinks.linkedin}` : 'Not set'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Battles Tab */}
        {activeTab === 'battles' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Battle Arena</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => router.push('/battle/real-time')}
                className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-xl text-white hover:scale-105 transition-transform"
              >
                <Swords className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-bold">Real-Time Battle</h3>
                <p className="text-red-100">Face opponents in live coding duels</p>
              </button>

              <button
                onClick={() => router.push('/battle')}
                className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white hover:scale-105 transition-transform"
              >
                <Trophy className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-bold">Tournament</h3>
                <p className="text-blue-100">Compete in tournaments</p>
              </button>

              <button
                onClick={() => router.push('/teams')}
                className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white hover:scale-105 transition-transform"
              >
                <Users className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-bold">Team Battles</h3>
                <p className="text-purple-100">Battle with your team</p>
              </button>
            </div>
          </motion.div>
        )}

        {/* Practice Tab */}
        {activeTab === 'practice' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Practice Challenges</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => router.push('/practice')}
                className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white hover:scale-105 transition-transform"
              >
                <Brain className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-bold">Algorithm Practice</h3>
                <p className="text-green-100">Sharpen your coding skills</p>
              </button>

              <button
                onClick={() => router.push('/code-arena')}
                className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white hover:scale-105 transition-transform"
              >
                <Target className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-bold">Code Arena</h3>
                <p className="text-orange-100">Advanced challenges</p>
              </button>

              <button
                onClick={() => router.push('/minimalist-mind')}
                className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 rounded-xl text-white hover:scale-105 transition-transform"
              >
                <Settings className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-bold">Minimalist Mind</h3>
                <p className="text-teal-100">Clean code challenges</p>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
