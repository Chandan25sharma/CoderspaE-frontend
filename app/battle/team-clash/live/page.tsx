'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Users, 
  Eye, 
  Play, 
  Clock, 
  RefreshCw,
  MonitorPlay,
  Zap,
  MessageCircle,
  Send,
  Shield,
  Trophy
} from 'lucide-react';
import UserTable from '@/components/battle/UserTable';
import ProblemsTable from '@/components/battle/ProblemsTable';
import { useRouter } from 'next/navigation';

interface LiveBattle {
  id: string;
  participants: Array<{
    id: string;
    username: string;
    avatar: string;
    score: number;
    progress: number;
  }>;
  problem: {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
  };
  startTime: string;
  duration: number;
  spectators: number;
  status: 'live' | 'starting' | 'finished';
  timeRemaining: number;
}

interface Comment {
  id: string;
  username: string;
  message: string;
  timestamp: string;
}

const TeamClashPage = () => {
  const router = useRouter();
  const [battles, setBattles] = useState<LiveBattle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'battles' | 'users' | 'problems'>('battles');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const initialComments: Comment[] = [
      {
        id: '1',
        username: 'TeamCaptain',
        message: 'Let\'s go Team Alpha! 🔥💙',
        timestamp: '30s ago'
      },
      {
        id: '2',
        username: 'CodeWarrior',
        message: 'Team Beta is crushing it! Great teamwork! 💚',
        timestamp: '2 min ago'
      },
      {
        id: '3',
        username: 'StrategyMaster',
        message: 'The collaboration in this match is incredible! 🤝',
        timestamp: '5 min ago'
      },
      {
        id: '4',
        username: 'TeamSpirit',
        message: 'Anyone looking for teammates? Ready to clash! ⚔️',
        timestamp: '8 min ago'
      }
    ];
    setComments(initialComments);
    fetchLiveBattles();
  }, []);

  const fetchLiveBattles = async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);

      const response = await fetch('/api/battles?battleMode=team-clash');
      
      if (!response.ok) {
        throw new Error('Failed to fetch live battles');
      }

      const result = await response.json();
      
      if (result.success) {
        setBattles(result.data);
        setError(null);
      } else {
        throw new Error(result.error || 'Failed to fetch battles');
      }
    } catch (err) {
      console.error('Error fetching battles:', err);
      setError(err instanceof Error ? err.message : 'Failed to load battles');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchLiveBattles(true);
  };

  const handleSpectate = (battleId: string) => {
    router.push(`/battle/${battleId}/spectate`);
  };

  const handleJoinBattle = (battleId: string) => {
    router.push(`/battle/${battleId}/join`);
  };

  const handleSendComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        username: 'You',
        message: newComment.trim(),
        timestamp: 'now'
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-cyan-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-400 mx-auto mb-4"></div>
              <p className="text-gray-300">Loading Team Clash battles...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-cyan-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-12 w-12 text-teal-400" />
            <h1 className="text-4xl font-bold text-white">Team Clash</h1>
            <Shield className="h-12 w-12 text-cyan-400" />
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Unite with your team and dominate in epic collaborative coding battles
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Navigation Tabs */}
            <motion.div
              className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex gap-2">
                {[
                  { id: 'battles', label: 'Team Battles', icon: MonitorPlay },
                  { id: 'users', label: 'Warriors', icon: Users },
                  { id: 'problems', label: 'Team Challenges', icon: Trophy }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'battles' | 'users' | 'problems')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-teal-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Tab Content */}
            {activeTab === 'battles' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Live Battles Header */}
                <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-3 py-1 bg-teal-600/20 rounded-full">
                        <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                        <span className="text-teal-400 text-sm font-medium">TEAM BATTLES</span>
                      </div>
                      <h2 className="text-2xl font-bold text-white">Active Team Wars</h2>
                    </div>
                    <button
                      onClick={handleRefresh}
                      disabled={refreshing}
                      className="flex items-center gap-2 px-4 py-2 bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/30 rounded-lg text-teal-400 text-sm transition-colors disabled:opacity-50"
                    >
                      {refreshing ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-400"></div>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4" />
                          Refresh
                        </>
                      )}
                    </button>
                  </div>

                  {error ? (
                    <div className="text-center text-red-400 py-12">
                      <p className="text-lg font-semibold mb-2">Error Loading Team Battles</p>
                      <p className="text-sm mb-4">{error}</p>
                      <button
                        onClick={handleRefresh}
                        className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-lg transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : battles.length === 0 ? (
                    <div className="text-center text-gray-400 py-12">
                      <Shield className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-semibold mb-2">No Active Team Battles</p>
                      <p className="text-sm">Form a team and start the clash!</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {battles.map((battle, index) => (
                        <motion.div
                          key={battle.id}
                          className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 hover:border-teal-500/30 transition-all"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Play className="h-4 w-4 text-green-400" />
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(battle.problem.difficulty)}`}>
                                  {battle.problem.difficulty}
                                </span>
                              </div>
                              <div>
                                <h3 className="text-white font-semibold text-lg">{battle.problem.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    {battle.participants.length} team members
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    {battle.spectators} spectators
                                  </span>
                                  {battle.status === 'live' && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      {formatTimeRemaining(battle.timeRemaining)} left
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSpectate(battle.id)}
                                  className="flex items-center gap-2 px-4 py-2 bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/30 rounded-lg text-teal-400 text-sm transition-colors"
                                >
                                  <Eye className="h-4 w-4" />
                                  Spectate War
                                </button>
                                {battle.status === 'starting' && (
                                  <button
                                    onClick={() => handleJoinBattle(battle.id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg text-green-400 text-sm transition-colors"
                                  >
                                    <Zap className="h-4 w-4" />
                                    Join Team
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <UserTable battleMode="Team Clash" />
              </motion.div>
            )}

            {activeTab === 'problems' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ProblemsTable battleMode="team-clash" />
              </motion.div>
            )}
          </div>

          {/* Live Comments Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6 h-fit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="h-5 w-5 text-teal-400" />
                <h3 className="text-lg font-semibold text-white">Team Chat</h3>
                <div className="flex items-center gap-1 px-2 py-1 bg-green-600/20 rounded-full ml-auto">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs">Live</span>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    className="bg-gray-800/50 rounded-lg p-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-teal-400 font-medium text-sm">{comment.username}</span>
                      <span className="text-gray-500 text-xs">{comment.timestamp}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{comment.message}</p>
                  </motion.div>
                ))}
              </div>

              {/* Comment Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Rally your team..."
                  className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-teal-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
                />
                <button
                  onClick={handleSendComment}
                  disabled={!newComment.trim()}
                  className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg transition-colors"
                >
                  <Send className="h-4 w-4 text-white" />
                </button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-gray-400 text-xs">
                  Coordinate with your team and dominate the battlefield! ⚔️🛡️
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamClashPage;
