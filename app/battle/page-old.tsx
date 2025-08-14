'use client';

import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import BattleDropdown from '@/components/battle/BattleDropdown';
import { 
  ArrowLeft, 
  Swords, 
  Zap, 
  Users, 
  Terminal, 
  Trophy, 
  Brain, 
  Code, 
  Eye, 
  Shield,
  Target,
  Clock,
  Sword
} from 'lucide-react';

export default function BattlePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [matrixElements, setMatrixElements] = useState<Array<{
    id: number;
    left: string;
    fontSize: string;
    duration: number;
    delay: number;
    character: string;
  }>>([]);
  const [isClient, setIsClient] = useState(false);

  function randomChar() {
    const chars = "アァイィウエカキクサシスセタチツナニハヒフヘホマミムメモラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return chars[Math.floor(Math.random() * chars.length)];
  }

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }
  }, [session, router]);

  useEffect(() => {
    setIsClient(true);
    const elements = Array.from({ length: 100 }, (_, i) => ({ 
      id: i,
      left: `${Math.random() * 100}%`,
      fontSize: `${Math.random() * 1.5 + 0.5}rem`,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 5,
      character: randomChar()
    }));
    setMatrixElements(elements);
  }, []);

  const battleModes = [
    {
      id: 'quick',
      title: 'Quick Duel',
      description: 'Fast-paced 1v1 battles with instant matchmaking',
      icon: Zap,
      difficulty: 'Beginner to Expert',
      duration: '5-15 min',
      players: '1v1',
      color: 'from-orange-500 to-red-500',
      route: '/battle/quick'
    },
    {
      id: 'team',
      title: 'Team Clash',
      description: 'Coordinate with your team to dominate the battlefield',
      icon: Users,
      difficulty: 'Intermediate+',
      duration: '15-30 min',
      players: '2v2, 3v3',
      color: 'from-blue-500 to-purple-500',
      route: '/battle/team'
    },
    {
      id: 'arena',
      title: 'Real-Time Arena',
      description: 'Live coding battles with real-time collaboration',
      icon: Terminal,
      difficulty: 'All Levels',
      duration: '10-20 min',
      players: '1v1, 2v2',
      color: 'from-green-500 to-emerald-500',
      route: '/battle/real-time'
    },
    {
      id: 'tournament',
      title: 'Tournament Mode',
      description: 'Compete in structured tournaments for ultimate glory',
      icon: Trophy,
      difficulty: 'Expert',
      duration: '30-60 min',
      players: 'Multi-round',
      color: 'from-purple-500 to-pink-500',
      route: '/tournament'
    },
    {
      id: 'minimalist',
      title: 'Minimalist Mind',
      description: 'Clean, distraction-free coding environment',
      icon: Brain,
      difficulty: 'All Levels',
      duration: '10-25 min',
      players: '1v1',
      color: 'from-cyan-500 to-blue-500',
      route: '/minimalist-mind'
    },
    {
      id: 'code-arena',
      title: 'Code Arena',
      description: 'Advanced coding challenges with multiple rounds',
      icon: Code,
      difficulty: 'Intermediate+',
      duration: '20-40 min',
      players: '1v1, Multi',
      color: 'from-indigo-500 to-purple-500',
      route: '/code-arena'
    },
    {
      id: 'live-viewer',
      title: 'Live Viewer',
      description: 'Watch and learn from top coders in real-time',
      icon: Eye,
      difficulty: 'Observer',
      duration: 'Ongoing',
      players: 'Spectator',
      color: 'from-teal-500 to-green-500',
      route: '/live-viewer'
    },
    {
      id: 'mirror-arena',
      title: 'Mirror Arena',
      description: 'Solve identical problems simultaneously',
      icon: Shield,
      difficulty: 'Intermediate',
      duration: '15-25 min',
      players: '1v1',
      color: 'from-pink-500 to-rose-500',
      route: '/mirror-arena'
    },
    {
      id: 'attack-defend',
      title: 'Attack & Defend',
      description: 'Strategic coding battles with offensive and defensive rounds',
      icon: Swords,
      difficulty: 'Advanced',
      duration: '20-35 min',
      players: '1v1, Team',
      color: 'from-red-500 to-orange-500',
      route: '/attack-defend'
    }
  ];

  if (!session) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Matrix Rain Effect */}
      <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none z-0">
        {isClient && matrixElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute font-mono text-green-400 text-sm [text-shadow:0_0_6px_#00FF00,0_0_10px_#00FF00]"
            style={{
              left: element.left,
              fontSize: element.fontSize,
            }}
            animate={{
              y: ['-100vh', '100vh'],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: element.duration,
              repeat: Infinity,
              delay: element.delay,
              ease: "linear"
            }}
          >
            {element.character}
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <div className="relative z-20 pt-6 px-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <motion.button
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white hover:bg-gray-700/50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </motion.button>
          </Link>
          
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Terminal className="inline w-10 h-10 mr-3 text-green-400" />
            BATTLE ARENA
          </motion.h1>
          
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Choose your battleground. Each mode offers unique challenges and rewards.
            Prove your skills across different coding disciplines.
          </motion.p>
        </div>

        {/* Battle Modes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {battleModes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group"
            >
              <Link href={mode.route}>
                <div className="h-full bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-all duration-300 cursor-pointer relative overflow-hidden">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <mode.icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                      {mode.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {mode.description}
                    </p>

                    {/* Stats */}
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-300">
                        <Target className="w-4 h-4 mr-2 text-blue-400" />
                        <span className="text-gray-500">Difficulty:</span>
                        <span className="ml-2">{mode.difficulty}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <Clock className="w-4 h-4 mr-2 text-green-400" />
                        <span className="text-gray-500">Duration:</span>
                        <span className="ml-2">{mode.duration}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <Users className="w-4 h-4 mr-2 text-purple-400" />
                        <span className="text-gray-500">Players:</span>
                        <span className="ml-2">{mode.players}</span>
                      </div>
                    </div>

                    {/* Enter Button */}
                    <motion.div
                      className={`mt-6 w-full py-3 bg-gradient-to-r ${mode.color} rounded-xl text-white font-semibold text-center group-hover:shadow-lg group-hover:shadow-current/50 transition-all duration-300`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Sword className="w-5 h-5" />
                        <span>ENTER BATTLE</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* System Status */}
        <motion.div
          className="fixed bottom-6 left-6 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl px-4 py-2 text-sm z-20"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-mono">SYSTEM_STATUS:</span>
            <span className="text-white font-mono">ONLINE</span>
            <span className="text-gray-400 font-mono ml-4">LATENCY:</span>
            <span className="text-cyan-400 font-mono">12ms</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
