'use client';

import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BattleDropdown from '@/components/battle/BattleDropdown';
import { ArrowLeft, Swords } from 'lucide-react';

interface BattleStats {
  activeBattles: number;
  onlinePlayers: number;
  todayMatches: number;
}

export default function BattlePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<BattleStats>({
    activeBattles: 0,
    onlinePlayers: 0,
    todayMatches: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchStats();
  }, [session, router]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      
      // Fetch active battles
      const battlesResponse = await fetch('/api/battles?status=active');
      const battlesData = await battlesResponse.json();
      
      // Fetch online users
      const usersResponse = await fetch('/api/users?isOnline=true');
      const usersData = await usersResponse.json();
      
      // Fetch today's battles
      const today = new Date().toISOString().split('T')[0];
      const todayBattlesResponse = await fetch(`/api/battles?date=${today}`);
      const todayBattlesData = await todayBattlesResponse.json();
      
      setStats({
        activeBattles: battlesData.pagination?.total || 0,
        onlinePlayers: usersData.pagination?.total || 0,
        todayMatches: todayBattlesData.pagination?.total || 0
      });
      
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Keep default values on error
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </motion.button>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-6">
            Choose Your Battle
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Select your preferred battle mode and prove your coding skills against developers worldwide.
          </p>
        </motion.div>

        {/* Main Battle Selection */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700">
            <div className="text-center mb-6">
              <Swords className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Select Battle Mode</h2>
              <p className="text-gray-400">Choose from our variety of competitive coding formats</p>
            </div>
            
            <BattleDropdown className="w-full" />
          </div>
        </motion.div>

        {/* Live Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {[
            { 
              label: 'Active Battles', 
              value: isLoading ? '...' : stats.activeBattles.toString(), 
              color: 'from-blue-400 to-cyan-400' 
            },
            { 
              label: 'Online Coders', 
              value: isLoading ? '...' : stats.onlinePlayers.toString(), 
              color: 'from-purple-400 to-pink-400' 
            },
            { 
              label: 'Today\'s Matches', 
              value: isLoading ? '...' : stats.todayMatches.toString(), 
              color: 'from-green-400 to-emerald-400' 
            }
          ].map((stat) => (
            <motion.div
              key={stat.label}
              className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 text-center"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                {stat.value}
              </div>
              <div className="text-gray-400">{stat.label}</div>
              {isLoading && (
                <div className="mt-2">
                  <div className="w-16 h-1 bg-gray-700 rounded mx-auto overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-r from-blue-400 to-cyan-400 animate-pulse"></div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Refresh Button */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={fetchStats}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-gray-300 rounded-lg transition-colors"
          >
            {isLoading ? 'Refreshing...' : 'Refresh Stats'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
