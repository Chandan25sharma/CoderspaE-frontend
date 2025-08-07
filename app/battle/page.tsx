'use client';

import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Code, 
  Terminal, 
  Users, 
  Trophy,
  Clock,
  Target,
  Sword,
  Shield,
  Binary
} from 'lucide-react';

export default function BattlePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showMatrix, setShowMatrix] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }
  }, [session, router]);

  useEffect(() => {
    // Matrix rain effect
    const canvas = document.getElementById('matrix-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    function draw() {
      ctx!.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx!.fillRect(0, 0, canvas.width, canvas.height);

      ctx!.fillStyle = '#0f4c75';
      ctx!.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx!.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const interval = setInterval(draw, 50);

    return () => clearInterval(interval);
  }, []);

  const battleModes = [
    {
      id: 'quick-duel',
      title: 'Quick Duel',
      description: 'Fast-paced 1v1 coding battles',
      icon: Zap,
      color: 'from-yellow-500 to-orange-600',
      href: '/battle/quick',
      difficulty: 'Beginner to Expert',
      duration: '5-15 min',
      players: '1v1'
    },
    {
      id: 'team-clash',
      title: 'Team Clash',
      description: 'Coordinate with teammates for victory',
      icon: Users,
      color: 'from-blue-500 to-purple-600',
      href: '/battle/team',
      difficulty: 'Intermediate+',
      duration: '15-30 min',
      players: '2v2, 3v3'
    },
    {
      id: 'real-time',
      title: 'Real-Time Arena',
      description: 'Live coding with instant feedback',
      icon: Terminal,
      color: 'from-green-500 to-teal-600',
      href: '/battle/real-time',
      difficulty: 'All Levels',
      duration: '10-20 min',
      players: '1v1, 2v2'
    },
    {
      id: 'tournament',
      title: 'Tournament Mode',
      description: 'Compete in structured competitions',
      icon: Trophy,
      color: 'from-purple-500 to-pink-600',
      href: '/tournament',
      difficulty: 'Expert',
      duration: '30-60 min',
      players: 'Multi-round'
    }
  ];

  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-green-400 mb-4 font-mono text-xl"
          >
            INITIALIZING_BATTLE_SYSTEMS...
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Matrix Background */}
      <canvas
        id="matrix-canvas"
        className="fixed inset-0 pointer-events-none opacity-20"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
          {Array.from({ length: 400 }).map((_, i) => (
            <div key={i} className="border border-green-500/20"></div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="flex items-center justify-center mb-8"
            >
              <div className="relative">
                <Sword className="h-20 w-20 text-red-500 absolute -rotate-45 -translate-x-4 -translate-y-2" />
                <Code className="h-24 w-24 text-green-400 relative z-10" />
                <Shield className="h-20 w-20 text-blue-500 absolute rotate-45 translate-x-4 -translate-y-2" />
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-6xl font-bold font-mono mb-6"
            >
              <span className="text-green-400">&gt;</span>
              <span className="text-white">BATTLE</span>
              <span className="text-red-500">_ARENA</span>
              <span className="text-green-400 animate-pulse">|</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-xl text-gray-300 max-w-4xl mx-auto font-mono"
            >
              {/* Enter the digital battlefield where code is your weapon */}
              <br />
              {/* Choose your battle mode and prove your programming prowess */}
            </motion.p>
          </motion.div>

          {/* Battle Mode Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {battleModes.map((mode, index) => (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.2 }}
                className="group relative"
              >
                <Link href={mode.href}>
                  <div className="relative bg-gray-900/50 backdrop-blur-sm border border-green-500/20 rounded-2xl p-8 hover:border-green-400/60 transition-all duration-500 overflow-hidden">
                    {/* Animated Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                    
                    {/* Binary Code Animation */}
                    <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                      <motion.div
                        animate={{ 
                          rotate: 360,
                        }}
                        transition={{ 
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        <Binary className="w-8 h-8 text-green-400" />
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-center mb-6">
                        <div className={`w-16 h-16 bg-gradient-to-br ${mode.color} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                          <mode.icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white font-mono mb-1">
                            {mode.title}
                          </h3>
                          <div className="text-green-400 text-sm font-mono">
                            {/* {mode.description} */}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-gray-300 font-mono text-sm">
                          <Target className="w-4 h-4 mr-3 text-blue-400" />
                          <span className="text-gray-500">difficulty:</span>
                          <span className="ml-2 text-white">{mode.difficulty}</span>
                        </div>
                        <div className="flex items-center text-gray-300 font-mono text-sm">
                          <Clock className="w-4 h-4 mr-3 text-yellow-400" />
                          <span className="text-gray-500">duration:</span>
                          <span className="ml-2 text-white">{mode.duration}</span>
                        </div>
                        <div className="flex items-center text-gray-300 font-mono text-sm">
                          <Users className="w-4 h-4 mr-3 text-purple-400" />
                          <span className="text-gray-500">players:</span>
                          <span className="ml-2 text-white">{mode.players}</span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full py-4 bg-gradient-to-r ${mode.color} text-white font-mono font-bold rounded-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group/btn`}
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          <Terminal className="w-5 h-5 mr-2" />
                          ENTER_BATTLE()
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500"></div>
                      </motion.button>
                    </div>

                    {/* Scan Line Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      style={{ width: '200%' }}
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center space-x-4 bg-gray-900/50 backdrop-blur-sm border border-green-500/20 rounded-full px-6 py-3 font-mono text-sm">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 bg-green-400 rounded-full"
              ></motion.div>
              <span className="text-gray-400">SYSTEM_STATUS:</span>
              <span className="text-green-400">ONLINE</span>
              <Terminal className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400">LATENCY:</span>
              <span className="text-green-400">12ms</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
