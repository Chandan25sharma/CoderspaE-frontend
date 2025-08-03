'use client';

import { motion } from 'framer-motion';
import { Crown, Star, Zap, Trophy, Target, Flame, Shield } from 'lucide-react';

interface BadgeProps {
  type: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  category: 'wins' | 'streak' | 'challenges' | 'speed' | 'accuracy' | 'contribution';
  level: number;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLevel?: boolean;
}

const badgeConfig = {
  bronze: {
    gradient: 'from-orange-600 to-orange-400',
    shadow: 'shadow-orange-500/50',
    glow: 'shadow-orange-500/30',
  },
  silver: {
    gradient: 'from-gray-400 to-gray-200',
    shadow: 'shadow-gray-500/50',
    glow: 'shadow-gray-500/30',
  },
  gold: {
    gradient: 'from-yellow-500 to-yellow-300',
    shadow: 'shadow-yellow-500/50',
    glow: 'shadow-yellow-500/30',
  },
  platinum: {
    gradient: 'from-purple-500 to-purple-300',
    shadow: 'shadow-purple-500/50',
    glow: 'shadow-purple-500/30',
  },
  diamond: {
    gradient: 'from-cyan-400 to-blue-300',
    shadow: 'shadow-cyan-500/50',
    glow: 'shadow-cyan-500/30',
  },
};

const categoryIcons = {
  wins: Trophy,
  streak: Flame,
  challenges: Target,
  speed: Zap,
  accuracy: Shield,
  contribution: Star,
};

const sizeConfig = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

export function AnimatedBadge({ 
  type, 
  category, 
  level, 
  animated = false, 
  size = 'md', 
  showLevel = true 
}: BadgeProps) {
  const config = badgeConfig[type];
  const Icon = categoryIcons[category];
  const sizeClass = sizeConfig[size];

  const badgeVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 200,
        damping: 15,
      }
    },
    hover: { 
      scale: 1.1,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        '0 0 20px rgba(255, 68, 68, 0.3)',
        '0 0 30px rgba(255, 68, 68, 0.5)',
        '0 0 20px rgba(255, 68, 68, 0.3)',
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      }
    }
  };

  return (
    <motion.div
      className="relative"
      initial={animated ? 'initial' : 'animate'}
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      variants={badgeVariants}
    >
      <motion.div
        className={`
          ${sizeClass} 
          rounded-full 
          bg-gradient-to-br ${config.gradient}
          ${config.shadow}
          shadow-lg
          border-2 border-white/20
          flex items-center justify-center
          relative overflow-hidden
          cursor-pointer
        `}
        variants={animated ? glowVariants : {}}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-white/10 rounded-full" />
        
        {/* Icon */}
        <Icon className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'} text-white z-10`} />
        
        {/* Level indicator */}
        {showLevel && (
          <motion.div 
            className="absolute -bottom-1 -right-1 bg-cyber-dark text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border border-white/30"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {level}
          </motion.div>
        )}
        
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
      
      {/* Badge name tooltip on hover */}
      <motion.div
        className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-cyber-dark text-white text-xs px-2 py-1 rounded opacity-0 pointer-events-none"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)} {category.charAt(0).toUpperCase() + category.slice(1)}
      </motion.div>
    </motion.div>
  );
}
