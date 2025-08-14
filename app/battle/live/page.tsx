'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Users, 
  Trophy, 
  Eye, 
  Play, 
  Clock, 
  RefreshCw,
  MonitorPlay,
  Zap
} from 'lucide-react';
import UserTable from '@/components/battle/UserTable';
import ProblemsTable from '@/components/battle/ProblemsTable';
import { useRouter } from 'next/navigation';

interface LiveBattle {
  id: string;
  battleMode?: string;
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

const LiveBattlesPage = () => {
  const router = useRouter();
  const [battles, setBattles] = useState<LiveBattle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'live' | 'starting'>('all');
  const [battleModeFilter, setBattleModeFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'battles' | 'users' | 'problems'>('battles');

  const battleModes = [
    'Quick Dual',
    'Minimalist Mind',
    'Mirror Arena', 
    'Narrative Mode',
    'Team Clash',
    'Attack & Defend'
  ];

  useEffect(() => {
    fetchLiveBattles();
  }, []);

  const fetchLiveBattles = async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);

      const response = await fetch('/api/battles');
      
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
    // Check if user can join or if it's spectate only
    router.push(`/battle/${battleId}/join`);
  };

  const filteredBattles = battles.filter(battle => {
    if (filter !== 'all' && battle.status !== filter) return false;
    if (battleModeFilter !== 'all' && battle.battleMode !== battleModeFilter) return false;
    return true;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return <Play className="h-4 w-4 text-green-400" />;
      case 'starting': return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'finished': return <Trophy className="h-4 w-4 text-gray-400" />;
      default: return null;
    }
  };

  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-300">Loading live battles...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-950 to-black p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <MonitorPlay className="h-12 w-12 text-blue-900" />
            <h1 className="text-4xl font-bold text-white">Live Battles Arena</h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Watch live coding battles, spectate matches, challenge other users, or create your own battles
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex gap-2">
            {[
              { id: 'battles', label: 'Live Battles', icon: MonitorPlay },
              { id: 'users', label: 'Online Users', icon: Users },
              { id: 'problems', label: 'Problems', icon: Trophy }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'battles' | 'users' | 'problems')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-800 text-white shadow-lg'
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
                  <div className="flex items-center gap-2 px-3 py-1  rounded-full">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <span className="text-red-400 text-sm font-medium">LIVE</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Active Battles</h2>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    {(['all', 'live', 'starting'] as const).map((filterOption) => (
                      <button
                        key={filterOption}
                        onClick={() => setFilter(filterOption)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filter === filterOption
                            ? 'bg-blue-800 text-white'
                            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2  hover:bg-blue-600/30  rounded-lg text-blue-800 text-sm transition-colors disabled:opacity-50"
                  >
                    {refreshing ? (
                      <div className="animate-spin rounded-full h-4 w-4"></div>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Battle Mode Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Battle Modes</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setBattleModeFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      battleModeFilter === 'all'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    All Modes
                  </button>
                  {battleModes.map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setBattleModeFilter(mode)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        battleModeFilter === mode
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {error ? (
                <div className="text-center text-red-400 py-12">
                  <p className="text-lg font-semibold mb-2">Error Loading Live Battles</p>
                  <p className="text-sm mb-4">{error}</p>
                  <button
                    onClick={handleRefresh}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredBattles.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  <MonitorPlay className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-semibold mb-2">No Active Battles</p>
                  <p className="text-sm">Be the first to start a battle or check back later!</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredBattles.map((battle, index) => (
                    <motion.div
                      key={battle.id}
                      className="bg-gray-900 backdrop-blur-sm rounded-xl p-6 hover:border-blue-500/30 transition-all"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(battle.status)}
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(battle.problem.difficulty)}`}>
                              {battle.problem.difficulty}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-lg">{battle.problem.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {battle.participants.length} participants
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {battle.spectators} watching
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
                          {/* Participants Preview */}
                          <div className="flex -space-x-2">
                            {battle.participants.slice(0, 3).map((participant) => (
                              <div
                                key={participant.id}
                                className="w-8 h-8 bg-gradient-to-br from-gray-950 to-white rounded-full border-2 border-gray-800 flex items-center justify-center text-xs font-bold text-white"
                                title={participant.username}
                              >
                                {participant.username.charAt(0).toUpperCase()}
                              </div>
                            ))}
                            {battle.participants.length > 3 && (
                              <div className="w-8 h-8 bg-gray-700 rounded-full border-2 border-gray-800 flex items-center justify-center text-xs text-gray-300">
                                +{battle.participants.length - 3}
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSpectate(battle.id)}
                              className="flex items-center gap-2 px-4 py-2  hover:bg-red-600/30  rounded-3xl text-red-400 text-sm transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                              Spectate
                            </button>
                            {battle.status === 'starting' && (
                              <button
                                onClick={() => handleJoinBattle(battle.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg text-green-400 text-sm transition-colors"
                              >
                                <Zap className="h-4 w-4" />
                                Join
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
            <UserTable battleMode="live" />
          </motion.div>
        )}

        {activeTab === 'problems' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ProblemsTable battleMode="live" />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LiveBattlesPage;
