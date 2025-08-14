'use client';

import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import QuickDualStats from '@/components/battle/QuickDualStats';
import UserTable from '@/components/battle/UserTable';
import ProblemsTable from '@/components/battle/ProblemsTable';

export default function NarrativeModePage() {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-black">
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
              className="flex items-center gap-2 px-4 py-2  text-gray-300 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </motion.button>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Narrative Mode Dashboard</h1>
                <p className="text-gray-400">Story-Driven Coding Adventures</p>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-gray-400 text-sm">Welcome back,</p>
            <p className="text-white font-semibold">{session.user?.name || 'Coder'}</p>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <QuickDualStats />

        {/* User Table */}
        <div className="mb-8">
          <UserTable battleMode="Narrative Mode" />
        </div>

        {/* Problems Table         <ProblemsTable battleMode="Narrative Mode" /> */}


        {/* Quick Actions Footer */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="text-gray-400 text-sm mb-4">
            Embark on story-driven coding quests with immersive problem scenarios and character development!
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
            <span>• Immersive storytelling</span>
            <span>• Character progression</span>
            <span>• Quest-based challenges</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
