'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Swords, 
  Users, 
  Trophy, 
  Shield, 
  Target,
  Eye,
  Brain,
  Layers,
  Code,
  Clock,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface BattleMode {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{className?: string}>;
  gradient: string;
  href: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  players: string;
  timeLimit: string;
  features: string[];
}

const battleModes: BattleMode[] = [
  {
    id: 'real-time',
    title: 'Real-Time Battle',
    description: 'Face opponents in live coding duels with real-time leaderboards',
    icon: Swords,
    gradient: 'from-red-500 to-pink-600',
    href: '/battle/real-time',
    difficulty: 'Hard',
    players: '1v1',
    timeLimit: '30 min',
    features: ['Live opponent', 'Real-time scoring', 'Instant feedback']
  },
  {
    id: 'minimalist-mind',
    title: 'Minimalist Mind',
    description: 'Focus on clean, minimal code solutions with elegant logic',
    icon: Brain,
    gradient: 'from-emerald-500 to-teal-600',
    href: '/minimalist-mind',
    difficulty: 'Medium',
    players: 'Solo',
    timeLimit: '45 min',
    features: ['Clean code focus', 'Minimal complexity', 'Logic puzzles']
  },
  {
    id: 'code-arena',
    title: 'Code Arena',
    description: 'Multi-language competitive programming with advanced challenges',
    icon: Code,
    gradient: 'from-blue-500 to-purple-600',
    href: '/code-arena',
    difficulty: 'Expert',
    players: 'Multi',
    timeLimit: '60 min',
    features: ['Multiple languages', 'Advanced algorithms', 'Tournament style']
  },
  {
    id: 'live-viewer',
    title: 'Live Viewer',
    description: 'Watch and learn from top coders in real-time battles',
    icon: Eye,
    gradient: 'from-orange-500 to-red-600',
    href: '/live-viewer',
    difficulty: 'Easy',
    players: 'Spectator',
    timeLimit: 'Varies',
    features: ['Watch live battles', 'Learn from pros', 'Chat with viewers']
  },
  {
    id: 'mirror-arena',
    title: 'Mirror Arena',
    description: 'Symmetric challenges where both players solve the same problem',
    icon: Layers,
    gradient: 'from-cyan-500 to-blue-600',
    href: '/mirror-arena',
    difficulty: 'Medium',
    players: '1v1',
    timeLimit: '40 min',
    features: ['Same problems', 'Speed focus', 'Mirror scoring']
  },
  {
    id: 'attack-defend',
    title: 'Attack & Defend',
    description: 'Offensive and defensive coding - break code or defend it',
    icon: Shield,
    gradient: 'from-purple-500 to-indigo-600',
    href: '/attack-defend',
    difficulty: 'Hard',
    players: '2v2',
    timeLimit: '50 min',
    features: ['Code breaking', 'Defense tactics', 'Team strategy']
  },
  {
    id: 'practice',
    title: 'Practice Mode',
    description: 'Hone your skills with curated challenges and tutorials',
    icon: BookOpen,
    gradient: 'from-green-500 to-emerald-600',
    href: '/practice',
    difficulty: 'Easy',
    players: 'Solo',
    timeLimit: 'Unlimited',
    features: ['Skill building', 'Tutorials', 'Progressive difficulty']
  },
  {
    id: 'tournament',
    title: 'Tournament',
    description: 'Compete in organized tournaments for ultimate glory',
    icon: Trophy,
    gradient: 'from-yellow-500 to-orange-600',
    href: '/tournament',
    difficulty: 'Expert',
    players: 'Multi',
    timeLimit: '2+ hours',
    features: ['Organized events', 'Prizes', 'Ranking system']
  }
];

const difficultyColors = {
  Easy: 'text-green-400 bg-green-500/20',
  Medium: 'text-yellow-400 bg-yellow-500/20',
  Hard: 'text-orange-400 bg-orange-500/20',
  Expert: 'text-red-400 bg-red-500/20'
};

export default function BattleModeSelector() {
  const router = useRouter();

  const handleModeSelect = (mode: BattleMode) => {
    router.push(mode.href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Choose Your Battle
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Select your preferred coding battle mode and prove your skills against developers worldwide
          </p>
        </motion.div>

        {/* Battle Modes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {battleModes.map((mode, index) => (
            <motion.div
              key={mode.id}
              className="group relative cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => handleModeSelect(mode)}
            >
              <div className={`relative bg-gradient-to-br ${mode.gradient} p-1 rounded-2xl overflow-hidden`}>
                <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 h-full">
                  {/* Icon and Title */}
                  <div className="flex items-center mb-4">
                    <div className={`p-3 bg-gradient-to-br ${mode.gradient} rounded-xl mr-4`}>
                      <mode.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{mode.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[mode.difficulty]}`}>
                        {mode.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {mode.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="flex items-center mb-2">
                        <Users className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-400">Players</span>
                      </div>
                      <span className="text-white font-semibold">{mode.players}</span>
                    </div>
                    <div>
                      <div className="flex items-center mb-2">
                        <Clock className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-400">Time</span>
                      </div>
                      <span className="text-white font-semibold">{mode.timeLimit}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">Features</h4>
                    <div className="space-y-2">
                      {mode.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center">
                          <Target className="w-3 h-3 text-green-400 mr-2" />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    className={`w-full bg-gradient-to-r ${mode.gradient} text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 group-hover:shadow-lg transition-all duration-300`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Enter Battle</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${mode.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10`} />
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <motion.div 
          className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {[
            { label: 'Active Battles', value: '127', icon: Swords },
            { label: 'Online Players', value: '2.3K', icon: Users },
            { label: 'Total Matches', value: '45K', icon: Trophy },
            { label: 'Languages', value: '12+', icon: Code }
          ].map((stat, index) => (
            <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-700/50">
              <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
