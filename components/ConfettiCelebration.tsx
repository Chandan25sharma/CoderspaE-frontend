'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

interface ConfettiCelebrationProps {
  trigger: boolean;
  type?: 'win' | 'level-up' | 'achievement';
  onComplete?: () => void;
}

export function ConfettiCelebration({ trigger, type = 'win', onComplete }: ConfettiCelebrationProps) {
  useEffect(() => {
    if (!trigger) return;

    const celebrate = () => {
      switch (type) {
        case 'win':
          // Victory confetti
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF4444', '#44FF88', '#4488FF', '#FFD700'],
          });
          break;
        
        case 'level-up':
          // Level up burst
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#FFD700', '#FF4444'],
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#FFD700', '#44FF88'],
          });
          break;
        
        case 'achievement':
          // Achievement fireworks
          const count = 200;
          const defaults = {
            origin: { y: 0.7 },
            colors: ['#FF4444', '#44FF88', '#4488FF', '#9D4EDD'],
          };

          function fire(particleRatio: number, opts: confetti.Options) {
            confetti({
              ...defaults,
              ...opts,
              particleCount: Math.floor(count * particleRatio),
            });
          }

          fire(0.25, { spread: 26, startVelocity: 55 });
          fire(0.2, { spread: 60 });
          fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
          fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
          fire(0.1, { spread: 120, startVelocity: 45 });
          break;
      }
    };

    celebrate();
    
    if (onComplete) {
      setTimeout(onComplete, 3000);
    }
  }, [trigger, type, onComplete]);

  if (!trigger) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-center"
      >
        {type === 'win' && (
          <div className="text-4xl font-bold text-neon-yellow animate-pulse-glow">
            🏆 VICTORY! 🏆
          </div>
        )}
        {type === 'level-up' && (
          <div className="text-4xl font-bold text-neon-green animate-level-up">
            ⚡ LEVEL UP! ⚡
          </div>
        )}
        {type === 'achievement' && (
          <div className="text-4xl font-bold text-neon-purple animate-bounce-subtle">
            🎖️ ACHIEVEMENT UNLOCKED! 🎖️
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default ConfettiCelebration;
