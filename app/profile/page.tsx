'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  User, Trophy, Star, Calendar, Target, Activity, BarChart3, 
  Zap, Edit3, Settings, MapPin, Link as LinkIcon, Users
} from 'lucide-react';
import { AnimatedBadge } from '../../components/AnimatedBadge';
import { XPProgressBar } from '../../components/XPProgressBar';
import { ConfettiCelebration } from '../../components/ConfettiCelebration';

interface UserStats {
  level: number;
  xp: number;
  nextLevelXP: number;
  rank: number;
  totalUsers: number;
  battlesWon: number;
  battlesPlayed: number;
  longestStreak: number;
  averageAccuracy: number;
  averageWPM: number;
  totalChallengesCompleted: number;
  favoriteLanguage: string;
  joinDate: string;
}

interface RecentActivity {
  id: string;
  type: 'battle' | 'challenge' | 'achievement' | 'tournament';
  title: string;
  description: string;
  timestamp: string;
  result?: 'win' | 'loss' | 'draw';
  points?: number;
}

const mockUserData = {
  username: 'CodeMaster_2024',
  email: 'codemaster@example.com',
  avatar: '/avatars/default.png',
  title: 'Elite Coder',
  bio: 'Passionate developer with expertise in full-stack development and competitive programming.',
  location: 'San Francisco, CA',
  website: 'https://codemaster.dev',
  socialLinks: {
    github: 'codemaster2024',
    twitter: 'codemaster_dev',
    linkedin: 'codemaster-pro'
  }
};

const mockUserStats: UserStats = {
  level: 42,
  xp: 15750,
  nextLevelXP: 18000,
  rank: 157,
  totalUsers: 25000,
  battlesWon: 87,
  battlesPlayed: 120,
  longestStreak: 15,
  averageAccuracy: 94.2,
  averageWPM: 75,
  totalChallengesCompleted: 234,
  favoriteLanguage: 'JavaScript',
  joinDate: '2024-01-15'
};

const mockRecentActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'battle',
    title: 'Mirror Arena Battle',
    description: 'Defeated AlgoNinja in JavaScript challenge',
    timestamp: '2024-08-02T10:30:00Z',
    result: 'win',
    points: 250
  },
  {
    id: '2',
    type: 'achievement',
    title: 'Speed Demon',
    description: 'Completed 10 challenges in under 5 minutes each',
    timestamp: '2024-08-01T16:45:00Z',
    points: 500
  },
  {
    id: '3',
    type: 'challenge',
    title: 'Binary Tree Traversal',
    description: 'Solved medium difficulty challenge',
    timestamp: '2024-08-01T14:20:00Z',
    points: 150
  },
  {
    id: '4',
    type: 'tournament',
    title: 'Weekly Code Challenge',
    description: 'Placed 3rd out of 128 participants',
    timestamp: '2024-07-31T20:00:00Z',
    result: 'win',
    points: 750
  },
  {
    id: '5',
    type: 'battle',
    title: 'Attack & Defend Mode',
    description: 'Close match against SpeedCoder',
    timestamp: '2024-07-30T18:15:00Z',
    result: 'loss',
    points: 50
  }
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showConfetti, setShowConfetti] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'activity', label: 'Recent Activity', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const winRate = Math.round((mockUserStats.battlesWon / mockUserStats.battlesPlayed) * 100);
  const rankPercentile = Math.round(((mockUserStats.totalUsers - mockUserStats.rank) / mockUserStats.totalUsers) * 100);

  // Overview Tab Content
  const OverviewContent = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full flex items-center justify-center text-3xl font-bold text-white">
              CM
            </div>
            <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1">
              <Star className="h-4 w-4 text-yellow-900" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{mockUserData.username}</h1>
              <AnimatedBadge 
                type="gold" 
                category="contribution" 
                level={mockUserStats.level} 
                size="md" 
              />
            </div>
            <p className="text-gray-400 mb-3">{mockUserData.bio}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{mockUserData.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date(mockUserStats.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <LinkIcon className="h-4 w-4" />
                <a href={mockUserData.website} className="text-neon-blue hover:underline">
                  {mockUserData.website}
                </a>
              </div>
            </div>
          </div>
          
          <button className="bg-neon-blue hover:bg-blue-600 text-cyber-dark px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 p-6 rounded-lg border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Current Level</p>
              <p className="text-3xl font-bold text-neon-blue">{mockUserStats.level}</p>
              <p className="text-green-400 text-sm">
                {mockUserStats.xp.toLocaleString()} / {mockUserStats.nextLevelXP.toLocaleString()} XP
              </p>
            </div>
            <Star className="h-8 w-8 text-yellow-400" />
          </div>
          <div className="mt-4">
            <XPProgressBar 
              currentXP={mockUserStats.xp} 
              nextLevelXP={mockUserStats.nextLevelXP}
              level={mockUserStats.level}
            />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 p-6 rounded-lg border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Global Rank</p>
              <p className="text-3xl font-bold text-neon-yellow">#{mockUserStats.rank}</p>
              <p className="text-green-400 text-sm">Top {rankPercentile}%</p>
            </div>
            <Trophy className="h-8 w-8 text-yellow-400" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 p-6 rounded-lg border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Battles Won</p>
              <p className="text-3xl font-bold text-neon-green">{mockUserStats.battlesWon}</p>
              <p className="text-green-400 text-sm">{winRate}% win rate</p>
            </div>
            <Zap className="h-8 w-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 p-6 rounded-lg border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Challenges Solved</p>
              <p className="text-3xl font-bold text-neon-purple">{mockUserStats.totalChallengesCompleted}</p>
              <p className="text-green-400 text-sm">{mockUserStats.averageAccuracy}% accuracy</p>
            </div>
            <Target className="h-8 w-8 text-purple-400" />
          </div>
        </motion.div>
      </div>

      {/* Level Progress */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Level Progress</h3>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Level {mockUserStats.level}</span>
            <span className="text-white">
              {mockUserStats.xp.toLocaleString()} / {mockUserStats.nextLevelXP.toLocaleString()} XP
            </span>
          </div>
          <XPProgressBar 
            currentXP={mockUserStats.xp} 
            nextLevelXP={mockUserStats.nextLevelXP}
            level={mockUserStats.level}
          />
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              {(mockUserStats.nextLevelXP - mockUserStats.xp).toLocaleString()} XP to level {mockUserStats.level + 1}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Statistics Tab Content
  const StatisticsContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Performance Statistics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Battle Performance */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">Battle Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Battles:</span>
              <span className="text-white">{mockUserStats.battlesPlayed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Battles Won:</span>
              <span className="text-green-400">{mockUserStats.battlesWon}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Win Rate:</span>
              <span className="text-white">{winRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Longest Streak:</span>
              <span className="text-yellow-400">{mockUserStats.longestStreak}</span>
            </div>
          </div>
        </div>

        {/* Coding Metrics */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">Coding Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Average WPM:</span>
              <span className="text-white">{mockUserStats.averageWPM}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Accuracy:</span>
              <span className="text-green-400">{mockUserStats.averageAccuracy}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Favorite Language:</span>
              <span className="text-blue-400">{mockUserStats.favoriteLanguage}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Challenges Completed:</span>
              <span className="text-white">{mockUserStats.totalChallengesCompleted}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Recent Activity Tab Content
  const ActivityContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
      
      <div className="space-y-4">
        {mockRecentActivity.map((activity) => (
          <motion.div
            key={activity.id}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'battle' ? 'bg-red-900 text-red-300' :
                  activity.type === 'challenge' ? 'bg-blue-900 text-blue-300' :
                  activity.type === 'achievement' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-purple-900 text-purple-300'
                }`}>
                  {activity.type === 'battle' ? <Zap className="h-4 w-4" /> :
                   activity.type === 'challenge' ? <Target className="h-4 w-4" /> :
                   activity.type === 'achievement' ? <Trophy className="h-4 w-4" /> :
                   <Users className="h-4 w-4" />}
                </div>
                <div>
                  <h4 className="text-white font-medium">{activity.title}</h4>
                  <p className="text-gray-400 text-sm">{activity.description}</p>
                  <p className="text-gray-500 text-xs">
                    {new Date(activity.timestamp).toLocaleDateString()} at {new Date(activity.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                {activity.result && (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    activity.result === 'win' ? 'bg-green-900 text-green-300' :
                    activity.result === 'loss' ? 'bg-red-900 text-red-300' :
                    'bg-gray-900 text-gray-300'
                  }`}>
                    {activity.result.toUpperCase()}
                  </span>
                )}
                {activity.points && (
                  <p className="text-neon-blue font-medium text-sm mt-1">
                    +{activity.points} XP
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cyber-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green bg-clip-text text-transparent mb-2">
            User Profile
          </h1>
          <p className="text-gray-400">
            Your complete coding journey and achievements
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-700 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-neon-blue text-cyber-dark font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && <OverviewContent />}
          {activeTab === 'statistics' && <StatisticsContent />}
          {activeTab === 'activity' && <ActivityContent />}
          {activeTab === 'achievements' && (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Achievements</h3>
              <p className="text-gray-400">
                Your badges and achievements will be displayed here.
              </p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <Settings className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Profile Settings</h3>
              <p className="text-gray-400">
                Customize your profile preferences and account settings here.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Confetti Animation */}
      {showConfetti && (
        <ConfettiCelebration 
          trigger={showConfetti}
          type="achievement"
          onComplete={() => setShowConfetti(false)} 
        />
      )}
    </div>
  );
}
