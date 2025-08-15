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
    username: string;
    status: string;
  }>;
  problem: {
    id?: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
  } | string;
  startTime: string;
  duration: number | string;
  spectators: number;
  status: 'live' | 'starting' | 'finished' | 'in_progress';
  timeRemaining?: number;
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

      // Try to fetch real battles first, fallback to demo if none exist
      const response = await fetch('/api/battles?demo=true');
      
      if (!response.ok) {
        throw new Error('Failed to fetch live battles');
      }

      const result = await response.json();
      
      if (result.success) {
        // Transform the data to match our interface
        const transformedBattles = result.data.map((battle: any) => ({
          ...battle,
          problem: typeof battle.problem === 'string' 
            ? { title: battle.problem, difficulty: battle.difficulty }
            : battle.problem,
          status: battle.status === 'in_progress' ? 'live' : battle.status,
          timeRemaining: battle.status === 'in_progress' || battle.status === 'live' 
            ? Math.max(0, 900 - Math.floor((Date.now() - new Date(battle.startTime).getTime()) / 1000))
            : 0
        }));
        setBattles(transformedBattles);
        setError(null);
        
        // Show demo indicator if using demo data
        if (result.isDemo) {
          console.log('Using demo battle data for UI demonstration');
        }
      } else {
        throw new Error(result.error || 'Failed to fetch battles');
      }
    } catch (err) {
      console.error('Error fetching battles:', err);
      setError(err instanceof Error ? err.message : 'Failed to load battles');
      
      // Set empty array instead of keeping stale data
      setBattles([]);
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
                <div className="space-y-8">
                  {/* Battles organized by battle mode */}
                  {battleModes.map((mode) => {
                    const modeBattles = filteredBattles.filter(battle => 
                      battleModeFilter === 'all' || battle.battleMode === mode
                    );
                    
                    if (modeBattles.length === 0 && battleModeFilter !== 'all') return null;
                    
                    return (
                      <div key={mode} className="space-y-4">
                        <div className="flex items-center gap-3 border-b border-gray-700/50 pb-2">
                          <Zap className="h-5 w-5 text-purple-400" />
                          <h3 className="text-xl font-bold text-white">{mode}</h3>
                          <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs">
                            {modeBattles.length} active
                          </span>
                        </div>
                        
                        {modeBattles.length === 0 ? (
                          <div className="text-center text-gray-500 py-8 border border-gray-800/30 rounded-xl bg-gray-900/20">
                            <p className="text-sm">No active battles in {mode} mode</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {modeBattles.map((battle, index) => (
                              <motion.div
                                key={battle.id}
                                className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                              >
                                {/* Battle Header */}
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(battle.status)}
                                    <span className="text-white font-semibold text-sm uppercase tracking-wide">
                                      {battle.status}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <Eye className="h-4 w-4" />
                                    <span>{battle.spectators}</span>
                                  </div>
                                </div>

                                {/* Problem Info */}
                                <div className="mb-4">
                                  <h4 className="text-white font-bold text-lg mb-2 line-clamp-1">
                                    {typeof battle.problem === 'string' ? battle.problem : battle.problem.title}
                                  </h4>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(typeof battle.problem === 'string' ? 'Medium' : battle.problem.difficulty)}`}>
                                      {typeof battle.problem === 'string' ? 'Medium' : battle.problem.difficulty}
                                    </span>
                                    {battle.status === 'live' && battle.timeRemaining && (
                                      <span className="text-gray-300 text-sm">
                                        ⏱️ {formatTimeRemaining(battle.timeRemaining)}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Participants */}
                                <div className="mb-6">
                                  <p className="text-gray-400 text-sm mb-2">Participants ({battle.participants.length})</p>
                                  <div className="flex -space-x-2">
                                    {battle.participants.slice(0, 4).map((participant, idx) => (
                                      <div
                                        key={idx}
                                        className="relative w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-gray-800 flex items-center justify-center"
                                        title={participant.username}
                                      >
                                        <span className="text-white text-xs font-bold">
                                          {participant.username.charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                    ))}
                                    {battle.participants.length > 4 && (
                                      <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-800 flex items-center justify-center">
                                        <span className="text-gray-300 text-xs">+{battle.participants.length - 4}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleSpectate(battle.id)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                  >
                                    <Eye className="h-4 w-4" />
                                    Watch
                                  </button>
                                  {battle.status === 'starting' && (
                                    <button
                                      onClick={() => handleJoinBattle(battle.id)}
                                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                      <Play className="h-4 w-4" />
                                      Join
                                    </button>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
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
