'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  Eye, 
  Clock, 
  Users,
  RefreshCw,
  Zap
} from 'lucide-react';

interface LiveBattle {
  id: string;
  battleId: string;
  battleMode: string;
  participants: Array<{
    username: string;
    status: string;
  }>;
  problem: string;
  difficulty: string;
  duration: string;
  spectators: number;
  status: string;
  startTime: string;
}

interface LiveBattlesProps {
  className?: string;
}

const LiveBattles: React.FC<LiveBattlesProps> = ({ className = '' }) => {
  const [battles, setBattles] = useState<LiveBattle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMode, setSelectedMode] = useState('All');

  const battleModes = ['All', 'Quick Dual', 'Minimalist Mind', 'Mirror Arena', 'Narrative Mode'];

  const fetchBattles = useCallback(async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);

      const modeParam = selectedMode === 'All' ? '' : `&battleMode=${encodeURIComponent(selectedMode.toLowerCase().replace(/\s+/g, '-'))}`;
      const response = await fetch(`/api/battles?status=active${modeParam}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch live battles');
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setBattles(Array.isArray(result.data) ? result.data : []);
        setError(null);
      } else {
        setBattles([]);
        throw new Error(result.error || 'Failed to fetch live battles');
      }
    } catch (err) {
      console.error('Error fetching live battles:', err);
      setError(err instanceof Error ? err.message : 'Failed to load live battles');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedMode]);

  useEffect(() => {
    fetchBattles();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchBattles(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchBattles]);

  const handleRefresh = () => {
    fetchBattles(true);
  };

  const joinSpectate = async (battle: LiveBattle) => {
    try {
      const response = await fetch('/api/battles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join_spectate',
          battleId: battle.battleId
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Navigate to spectate page
        window.location.href = result.spectateUrl;
      } else {
        console.error('Failed to join spectate:', result.error);
      }
    } catch (error) {
      console.error('Error joining spectate:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'hard': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getBattleModeColor = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'quick-dual': return 'text-red-400 bg-red-400/20';
      case 'minimalist-mind': return 'text-purple-400 bg-purple-400/20';
      case 'mirror-arena': return 'text-blue-400 bg-blue-400/20';
      case 'narrative-mode': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  if (loading) {
    return (
      <div className={`bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6 ${className}`}>
        <div className="text-center text-red-400">
          <p className="font-semibold mb-2">Error Loading Live Battles</p>
          <p className="text-sm mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-950 backdrop-blur-xl rounded-2xl p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Play className="h-6 w-6 text-red-400" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          </div>
          <h2 className="text-2xl font-bold text-white">Live Battles</h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-red-600/20 rounded-full">
            <Zap className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-medium">{battles?.length || 0} Active</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 bg-gray-900/50 hover:bg-gray-700 rounded-lg text-gray-300 text-sm transition-colors disabled:opacity-50"
          >
            {refreshing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select
          value={selectedMode}
          onChange={(e) => setSelectedMode(e.target.value)}
          className="bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-red-500"
        >
          {battleModes.map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>
      </div>

      {/* Battles Grid */}
      {battles && battles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {battles.map((battle, index) => (
            <motion.div
              key={battle.id}
              className="bg-gray-900 rounded-lg  p-4 hover:bg-gray-800/70 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Battle Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-900 rounded-full animate-pulse"></div>
                  <span className="text-red-400 text-sm font-medium">LIVE</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getBattleModeColor(battle.battleMode)}`}>
                  {battle.battleMode.replace(/-/g, ' ')}
                </span>
              </div>

              {/* Problem Info */}
              <div className="mb-3">
                <h3 className="text-white font-medium text-sm mb-1">{battle.problem}</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(battle.difficulty)}`}>
                    {battle.difficulty}
                  </span>
                  <div className="flex items-center gap-1 text-blue-400 text-xs">
                    <Clock className="h-3 w-3" />
                    {battle.duration}
                  </div>
                </div>
              </div>

              {/* Participants */}
              <div className="mb-4">
                <div className="flex items-center gap-1 mb-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400 text-xs">Participants</span>
                </div>
                <div className="space-y-1">
                  {battle.participants?.slice(0, 2).map((participant, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-white">{participant.username}</span>
                      <span className={`px-2 py-1 rounded ${
                        participant.status === 'active' ? 'text-green-900' : 'bg-gray-600/20 text-gray-400'
                      }`}>
                        {participant.status}
                      </span>
                    </div>
                  ))}
                  {battle.participants && battle.participants.length > 2 && (
                    <div className="text-gray-400 text-xs">
                      +{battle.participants.length - 2} more
                    </div>
                  )}
                </div>
              </div>

              {/* Spectators and Action */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                  <Eye className="h-3 w-3" />
                  <span>{battle.spectators || 0} watching</span>
                </div>
                <button
                  onClick={() => joinSpectate(battle)}
                  className="flex items-center gap-1 px-3 py-1  hover:bg-red-600/30 rounded text-red-800 text-xs transition-colors"
                >
                  <Eye className="h-3 w-3" />
                  Spectate
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-12">
          <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No Live Battles</p>
          <p className="text-sm">Check back soon for active competitions!</p>
        </div>
      )}
    </div>
  );
};

export default LiveBattles;
