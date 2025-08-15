'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight,
  Play,
  Trophy
} from 'lucide-react';

interface CTAButtonsProps {
  onEnterBattle?: () => void;
}

const CTAButtons: React.FC<CTAButtonsProps> = ({ onEnterBattle }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleGetStarted = () => {
    if (onEnterBattle) {
      onEnterBattle();
    } else if (session) {
      router.push('/live');
    } else {
      router.push('/auth/signin');
    }
  };

  return (
    <motion.div 
      className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      {/* Main Action Button */}
      <motion.button
        onClick={handleGetStarted}
        className="group relative px-8 py-4 bg-gradient-to-r from-gray-600 to-black text-white font-bold text-lg rounded-2xl overflow-hidden shadow-2xl"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl"
          initial={{ x: '-100%' }}
          whileHover={{ x: 0 }}
          transition={{ duration: 0.3 }}
        />
        <span className="relative z-10 flex items-center gap-2">
          <Play className="w-5 h-5" />
          {session ? 'Start Battle' : 'Get Started'}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </span>
        <motion.div
          className="absolute inset-0 bg-white/20"
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>

      {/* Leaderboard Button */}
      <Link href="/leaderboard">
        <motion.button
          className="group px-8 py-4 bg-white/1 backdrop-blur-sm text-white font-semibold text-lg rounded-2xl border border-white/20 hover:bg-white/40 transition-all duration-300"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            View Leaderboard
          </span>
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default CTAButtons;
