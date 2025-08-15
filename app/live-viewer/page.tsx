'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Eye, Users, Clock, Trophy } from 'lucide-react';

interface LiveBattle {
  id: string;
  title: string;
  participants: {
    id: string;
    username: string;
    avatar?: string;
  }[];
  viewers: number;
  startTime: string;
  status: 'live' | 'starting' | 'finished';
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function LiveViewerPage() {
  const [liveBattles, setLiveBattles] = useState<LiveBattle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveBattles = async () => {
      try {
        const response = await fetch('/api/battles?status=live');
        if (response.ok) {
          const data = await response.json();
          setLiveBattles(data.battles || []);
        }
      } catch (error) {
        console.error('Failed to fetch live battles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveBattles();
    const interval = setInterval(fetchLiveBattles, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p>Loading live battles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Eye className="text-purple-400" />
            Live Battle Viewer
          </h1>
          <p className="text-gray-300 text-lg">
            Watch live coding battles and learn from the best developers
          </p>
        </motion.div>

        {liveBattles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 max-w-md mx-auto">
              <Trophy className="text-gray-400 w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Live Battles</h3>
              <p className="text-gray-400">
                There are no live battles happening right now. Check back later or start your own battle!
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveBattles.map((battle, index) => (
              <motion.div
                key={battle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white truncate">
                    {battle.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    battle.status === 'live' 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {battle.status === 'live' ? '🔴 LIVE' : '⏳ Starting'}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{battle.participants.length} fighters</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">{battle.viewers} viewers</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">
                    Started {new Date(battle.startTime).toLocaleTimeString()}
                  </span>
                </div>

                <div className="flex -space-x-2 mb-4">
                  {battle.participants.slice(0, 3).map((participant) => (
                    <div
                      key={participant.id}
                      className="w-8 h-8 rounded-full bg-purple-600 border-2 border-gray-800 flex items-center justify-center text-white text-sm font-medium"
                    >
                      {participant.avatar ? (
                        <Image
                          src={participant.avatar}
                          alt={participant.username}
                          width={32}
                          height={32}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        participant.username.charAt(0).toUpperCase()
                      )}
                    </div>
                  ))}
                  {battle.participants.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-gray-800 flex items-center justify-center text-white text-xs">
                      +{battle.participants.length - 3}
                    </div>
                  )}
                </div>

                <button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  onClick={() => {
                    // Navigate to battle viewer
                    window.location.href = `/battle/${battle.id}/watch`;
                  }}
                >
                  <Eye className="w-4 h-4" />
                  Watch Battle
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}