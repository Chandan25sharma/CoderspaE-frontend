'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface XPProgressBarProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
  animated?: boolean;
  showNumbers?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function XPProgressBar({ 
  currentXP, 
  nextLevelXP, 
  level, 
  animated = true, 
  showNumbers = true,
  size = 'md' 
}: XPProgressBarProps) {
  const [displayXP, setDisplayXP] = useState(0);
  const progress = Math.min((currentXP / nextLevelXP) * 100, 100);

  const sizeConfig = {
    sm: { height: 'h-2', text: 'text-xs', padding: 'px-2 py-1' },
    md: { height: 'h-4', text: 'text-sm', padding: 'px-3 py-2' },
    lg: { height: 'h-6', text: 'text-base', padding: 'px-4 py-3' },
  };

  const config = sizeConfig[size];

  useEffect(() => {
    if (!animated) {
      setDisplayXP(currentXP);
      return;
    }

    const startTime = Date.now();
    const duration = 1000; // 1 second animation
    const startXP = displayXP;
    const endXP = currentXP;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      const newXP = startXP + (endXP - startXP) * easedProgress;
      
      setDisplayXP(Math.floor(newXP));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [currentXP, animated, displayXP]);

  return (
    <div className="w-full">
      {/* Header with level and XP */}
      {showNumbers && (
        <div className="flex justify-between items-center mb-2">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-neon-gradient text-white px-3 py-1 rounded-full text-sm font-bold">
              LVL {level}
            </div>
          </motion.div>
          
          <motion.div 
            className={`${config.text} text-gray-300`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {displayXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
          </motion.div>
        </div>
      )}

      {/* Progress bar container */}
      <div className={`w-full ${config.height} bg-cyber-gray rounded-full overflow-hidden relative`}>
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-blue/20 to-transparent animate-pulse" />
        
        {/* Progress fill */}
        <motion.div
          className="h-full bg-gradient-to-r from-neon-blue via-neon-green to-neon-yellow relative overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ 
            duration: animated ? 1.5 : 0, 
            ease: 'easeOut',
            delay: animated ? 0.5 : 0
          }}
        >
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Progress percentage overlay */}
        {progress > 15 && (
          <motion.div
            className={`absolute inset-0 flex items-center justify-center ${config.text} font-bold text-white mix-blend-difference`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: animated ? 1 : 0 }}
          >
            {Math.round(progress)}%
          </motion.div>
        )}
      </div>

      {/* XP gain indicator */}
      {animated && currentXP > 0 && (
        <motion.div
          className="text-neon-green text-sm font-semibold mt-1 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ delay: 0.8 }}
        >
          +{currentXP} XP gained!
        </motion.div>
      )}
    </div>
  );
}
