'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sword, 
  Users, 
  Trophy, 
  Zap, 
  Shield, 
  Target, 
  Clock, 
  Star,
  Crown,
  Flame,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface BattleMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  players: string;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  rewards: string[];
  isPopular?: boolean;
  isNew?: boolean;
  isPremium?: boolean;
}

const battleModes: BattleMode[] = [
  {
    id: '1v1',
    name: 'Quick Duel',
    description: 'Fast-paced 1v1 coding battles. Perfect for quick skill tests.',
    icon: <Sword className="w-8 h-8" />,
    color: 'from-red-500 to-pink-600',
    gradient: 'bg-gradient-to-br from-red-500/20 to-pink-600/20',
    players: '1v1',
    duration: '10 min',
    difficulty: 'Easy',
    rewards: ['50 XP', 'Ranking Points'],
    isPopular: true
  },
  {
    id: 'team',
    name: 'Team Clash',
    description: 'Coordinate with teammates in epic team battles.',
    icon: <Users className="w-8 h-8" />,
    color: 'from-blue-500 to-cyan-600',
    gradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-600/20',
    players: '3v3',
    duration: '20 min',
    difficulty: 'Medium',
    rewards: ['100 XP', 'Team Tokens', 'Badges'],
  },
  {
    id: 'tournament',
    name: 'Grand Tournament',
    description: 'Compete against the best in elimination-style tournaments.',
    icon: <Trophy className="w-8 h-8" />,
    color: 'from-yellow-500 to-orange-600',
    gradient: 'bg-gradient-to-br from-yellow-500/20 to-orange-600/20',
    players: '16+',
    duration: '60 min',
    difficulty: 'Hard',
    rewards: ['500 XP', 'Exclusive Titles', 'Premium Rewards'],
    isNew: true
  },
  {
    id: 'blitz',
    name: 'Lightning Blitz',
    description: 'Ultra-fast coding challenges. Think fast, code faster!',
    icon: <Zap className="w-8 h-8" />,
    color: 'from-purple-500 to-indigo-600',
    gradient: 'bg-gradient-to-br from-purple-500/20 to-indigo-600/20',
    players: '1v1',
    duration: '5 min',
    difficulty: 'Medium',
    rewards: ['25 XP', 'Speed Bonuses'],
  },
  {
    id: 'survival',
    name: 'Code Survival',
    description: 'Last coder standing wins. Eliminate competitors one by one.',
    icon: <Shield className="w-8 h-8" />,
    color: 'from-green-500 to-emerald-600',
    gradient: 'bg-gradient-to-br from-green-500/20 to-emerald-600/20',
    players: '8+',
    duration: '30 min',
    difficulty: 'Hard',
    rewards: ['200 XP', 'Survival Badges', 'Rare Items'],
  },
  {
    id: 'target',
    name: 'Target Practice',
    description: 'Precision coding challenges with specific targets to hit.',
    icon: <Target className="w-8 h-8" />,
    color: 'from-teal-500 to-cyan-600',
    gradient: 'bg-gradient-to-br from-teal-500/20 to-cyan-600/20',
    players: 'Solo',
    duration: '15 min',
    difficulty: 'Easy',
    rewards: ['75 XP', 'Accuracy Points'],
  },
  {
    id: 'master',
    name: 'Master\'s Arena',
    description: 'Elite battles for the most skilled coders. Premium only.',
    icon: <Crown className="w-8 h-8" />,
    color: 'from-amber-500 to-yellow-600',
    gradient: 'bg-gradient-to-br from-amber-500/20 to-yellow-600/20',
    players: '1v1',
    duration: '25 min',
    difficulty: 'Expert',
    rewards: ['1000 XP', 'Master Titles', 'Legendary Items'],
    isPremium: true
  },
  {
    id: 'chaos',
    name: 'Chaos Mode',
    description: 'Unpredictable challenges with changing rules. Adapt or fall!',
    icon: <Flame className="w-8 h-8" />,
    color: 'from-orange-500 to-red-600',
    gradient: 'bg-gradient-to-br from-orange-500/20 to-red-600/20',
    players: '2-6',
    duration: '20 min',
    difficulty: 'Expert',
    rewards: ['300 XP', 'Chaos Tokens', 'Mystery Rewards'],
    isNew: true
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.8
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20
    }
  },
  hover: {
    scale: 1.05,
    y: -10,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 10
    }
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy': return 'text-green-400 bg-green-500/20';
    case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
    case 'Hard': return 'text-orange-400 bg-orange-500/20';
    case 'Expert': return 'text-red-400 bg-red-500/20';
    default: return 'text-gray-400 bg-gray-500/20';
  }
};

export default function DynamicBattleModes() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleModeSelect = async (modeId: string) => {
    setIsLoading(true);
    setSelectedMode(modeId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Navigate to battle (you can implement routing here)
    console.log(`Starting battle mode: ${modeId}`);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-6"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            Battle Modes
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Choose your battlefield and prove your coding prowess in various game modes
          </motion.p>
        </motion.div>

        {/* Battle Modes Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {battleModes.map((mode, index) => (
            <motion.div
              key={mode.id}
              variants={cardVariants}
              whileHover="hover"
              className={`relative group cursor-pointer ${mode.gradient} backdrop-blur-sm border border-white/10 rounded-2xl p-6 overflow-hidden`}
              onMouseEnter={() => setHoveredMode(mode.id)}
              onMouseLeave={() => setHoveredMode(null)}
              onClick={() => handleModeSelect(mode.id)}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
              
              {/* Badges */}
              <div className="absolute top-4 right-4 flex gap-2">
                {mode.isPopular && (
                  <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full font-semibold flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    Popular
                  </span>
                )}
                {mode.isNew && (
                  <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    New
                  </span>
                )}
                {mode.isPremium && (
                  <span className="px-2 py-1 bg-amber-500 text-white text-xs rounded-full font-semibold flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Premium
                  </span>
                )}
              </div>

              {/* Icon */}
              <motion.div 
                className={`w-16 h-16 bg-gradient-to-br ${mode.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                whileHover={{ rotate: 10 }}
              >
                {mode.icon}
              </motion.div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                  {mode.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {mode.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-gray-300">
                      <Users className="w-4 h-4" />
                      {mode.players}
                    </span>
                    <span className="flex items-center gap-1 text-gray-300">
                      <Clock className="w-4 h-4" />
                      {mode.duration}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(mode.difficulty)}`}>
                    {mode.difficulty}
                  </span>
                </div>

                {/* Rewards */}
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Rewards</p>
                  <div className="flex flex-wrap gap-1">
                    {mode.rewards.slice(0, 2).map((reward, i) => (
                      <span key={i} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded">
                        {reward}
                      </span>
                    ))}
                    {mode.rewards.length > 2 && (
                      <span className="text-xs text-gray-400">+{mode.rewards.length - 2} more</span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <motion.button
                  className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Enter Battle
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>

              {/* Hover Effect Overlay */}
              <AnimatePresence>
                {hoveredMode === mode.id && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gray-800 rounded-2xl p-8 text-center"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
              >
                <motion.div
                  className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <h3 className="text-xl font-bold text-white mb-2">Preparing Battle</h3>
                <p className="text-gray-400">Finding worthy opponents...</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
