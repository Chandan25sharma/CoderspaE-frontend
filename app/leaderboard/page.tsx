'use client';

import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Trophy } from 'lucide-react';
import Leaderboard from '@/components/Leaderboard';

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    setIsLoading(false);
  }, [session, router]);

  if (isLoading || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <motion.div
          className="text-white text-xl"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-950 to-black">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-900 rounded-xl text-gray-300 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </motion.button>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-950 to-orange-500 rounded-4xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Global Leaderboard</h1>
                <p className="text-gray-400">Rankings of all CoderspaE warriors</p>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-gray-400 text-sm">Welcome back,</p>
            <p className="text-white font-semibold">{session.user?.name || 'Coder'}</p>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Leaderboard />
        </motion.div>

        {/* Footer Info */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="text-gray-400 text-sm mb-4">
            Rankings are updated in real-time based on battle results and achievements.
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
            <span>• Global rankings</span>
            <span>• Real-time updates</span>
            <span>• Team statistics</span>
            <span>• Win/Loss tracking</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
