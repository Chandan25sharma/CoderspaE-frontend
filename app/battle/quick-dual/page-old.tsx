'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Zap, Users, Clock, Trophy } from 'lucide-react';
import LiveMatchScreen from '@/components/battle/LiveMatchScreen';

export default function QuickDualPage() {
  const router = useRouter();
  const [isInMatch, setIsInMatch] = React.useState(false);
  const [isSearching, setIsSearching] = React.useState(false);

  const handleStartMatch = () => {
    setIsSearching(true);
    // Simulate matchmaking
    setTimeout(() => {
      setIsSearching(false);
      setIsInMatch(true);
    }, 3000);
  };

  if (isInMatch) {
    return <LiveMatchScreen matchId="quick-dual-123" isSpectator={false} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.button
            onClick={() => router.push('/battle')}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Quick Dual (1v1)</h1>
          </div>
        </motion.div>

        {isSearching ? (
          /* Matchmaking Screen */
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <h2 className="text-2xl font-bold text-white mb-2">Finding Your Opponent...</h2>
            <p className="text-gray-400 mb-6">Matching you with a player of similar skill level</p>
            <motion.button
              onClick={() => setIsSearching(false)}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel Search
            </motion.button>
          </motion.div>
        ) : (
          /* Main Content */
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Mode Info */}
              <motion.div
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold text-white mb-4">Battle Info</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">1v1 Real-time Battle</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">15-30 minutes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-300">Ranked Match (+25 ELO)</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <h3 className="font-semibold text-blue-400 mb-2">How it works:</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Get matched with a player of similar skill</li>
                    <li>• Solve the same coding problem simultaneously</li>
                    <li>• First to submit correct solution wins</li>
                    <li>• Live camera feeds and spectator mode</li>
                  </ul>
                </div>
              </motion.div>

              {/* Current Stats */}
              <motion.div
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-white mb-4">Live Stats</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Active Duels</span>
                    <span className="text-2xl font-bold text-blue-400">47</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Players in Queue</span>
                    <span className="text-2xl font-bold text-green-400">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Avg. Match Time</span>
                    <span className="text-2xl font-bold text-yellow-400">8m</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Recent Winners</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">CodeMaster123</span>
                      <span className="text-green-400">2m 34s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">AlgoNinja99</span>
                      <span className="text-green-400">3m 12s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">DevQueen42</span>
                      <span className="text-green-400">4m 01s</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Start Battle Button */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.button
                onClick={handleStartMatch}
                className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl rounded-2xl shadow-2xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="flex items-center gap-3">
                  <Zap className="w-6 h-6" />
                  Start Quick Dual
                </span>
              </motion.button>
              <p className="text-gray-400 mt-4">
                Average queue time: <span className="text-blue-400 font-semibold">2-5 seconds</span>
              </p>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
