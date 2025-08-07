'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Code, 
  Trophy, 
  Users, 
  Zap, 
  ArrowRight,
  Play,
  Crown,
  ChevronDown
} from 'lucide-react';

interface AnimatedHeroProps {
  onEnterBattle?: () => void;
}

const AnimatedHero: React.FC<AnimatedHeroProps> = ({ onEnterBattle }) => {
  const [currentWord, setCurrentWord] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [matrixElements, setMatrixElements] = useState<Array<{
    id: number;
    left: string;
    fontSize: string;
    duration: number;
    delay: number;
    character: string;
  }>>([]);
  const [isClient, setIsClient] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  
  const words = ['Battle', 'Compete', 'Dominate', 'Conquer', 'Master'];

  const handleGetStarted = () => {
    if (session) {
      router.push('/battle');
    } else {
      router.push('/auth/signup');
    }
  };
  function randomChar() {
  const chars = "アァイィウエカキクサシスセタチツナニハヒフヘホマミムメモラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return chars[Math.floor(Math.random() * chars.length)];
}

  
  useEffect(() => {
    setIsClient(true);
    // Generate random values once on client side
    const matrixElements = Array.from({ length: 150 }, (_, i) => ({ 
      id: i,
      left: `${Math.random() * 100}%`,
      fontSize: `${Math.random() * 1.5 + 0.5}rem`,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 5,
      character: randomChar()
    }));
    setMatrixElements(matrixElements);
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(false);
      setTimeout(() => {
        setCurrentWord((prev) => (prev + 1) % words.length);
        setIsTyping(true);
      }, 500);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Matrix Rain Effect */}
       <div className="absolute inset-0 overflow-hidden opacity-40 pointer-events-none z-0">
        {isClient && matrixElements.map((matrixElement) => (
          <motion.div
            key={matrixElement.id}
            className="absolute font-mono text-green-400 text-sm [text-shadow:0_0_6px_#00FF00,0_0_10px_#00FF00]"

            style={{
              left: matrixElement.left,
              fontSize: matrixElement.fontSize,
            }}
           animate={{
            y: ['-100vh', '100vh'],
            opacity: [0, 1, 0],
            rotate: [0, 0, 360], // optional subtle spin
            }}
            transition={{
              duration: matrixElement.duration,
              repeat: Infinity,
              delay: matrixElement.delay,
              ease: "linear"
            }}
          >
            {matrixElement.character}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        {/* Logo Animation */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-34 h-34 rounded-xl mb-6 relative overflow-hidden"
            whileHover={{ 
              scale: 1.1, 
              rotate: 330,
              boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Image
              src="/icon.png"
              alt="CoderspaE Logo"
              width={100}
              height={48}
              className="object-contain"
            />
          </motion.div>
        </motion.div>

        {/* Dynamic Title */}
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Code.
          </span>
          <br />
          <AnimatePresence mode="wait">
            <motion.span
              key={currentWord}
              className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 50, rotateX: -90 }}
              animate={{ 
                opacity: isTyping ? 1 : 0, 
                y: 29, 
                rotateX: 0 
              }}
              exit={{ opacity: 0, y: -50, rotateX: 90 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              {words[currentWord]}.
            </motion.span>
          </AnimatePresence>
          <br />
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Join the ultimate competitive programming arena where developers worldwide
          clash in real-time coding battles. Rise through the ranks and become a 
          <span className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text font-semibold"> Code Legend</span>.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.button
            onClick={handleGetStarted}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl overflow-hidden shadow-2xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <Play className="w-5 h-5" />
              {session ? 'Enter Battle' : 'Get Started'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>

          <Link href="/leaderboard">
            <motion.button
              className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold text-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
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

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { icon: Users, label: 'Active Players', value: '50K+', color: 'from-blue-400 to-cyan-400' },
            { icon: Zap, label: 'Battles Today', value: '12K+', color: 'from-purple-400 to-pink-400' },
            { icon: Trophy, label: 'Tournaments', value: '500+', color: 'from-yellow-400 to-orange-400' },
            { icon: Crown, label: 'Champions', value: '1.2K', color: 'from-emerald-400 to-green-400' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="group text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:shadow-lg group-hover:shadow-current/50 transition-all duration-300`}
                whileHover={{ rotate: 10 }}
              >
                <stat.icon className="w-8 h-8 text-white" />
              </motion.div>
              <motion.div
                className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <motion.div
          className="flex flex-col items-center text-gray-400 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-sm mb-2">Scroll to explore</span>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AnimatedHero;
