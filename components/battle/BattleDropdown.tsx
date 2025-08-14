'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ChevronDown, 
  Zap, 
  Brain, 
  RotateCcw, 
  BookOpen, 
  Users, 
  Shield,
  Swords,
  MonitorPlay
} from 'lucide-react';

interface BattleDropdownProps {
  className?: string;
}

const BattleDropdown: React.FC<BattleDropdownProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const battleModes = [
    {
      id: 'live-battles',
      name: 'Live Battles',
      description: 'Watch and join live coding battles',
      icon: MonitorPlay,
      color: 'from-red-500 to-orange-500',
      route: '/battle/live'
    },
    {
      id: 'quick-dual',
      name: 'Quick Dual (1v1)',
      description: 'Fast-paced 1v1 coding battles',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      route: '/battle/quick-dual'
    },
    {
      id: 'minimalist-mind',
      name: 'Minimalist Mind',
      description: 'Code with minimal UI distractions',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      route: '/battle/minimalist-mind'
    },
    {
      id: 'mirror-arena',
      name: 'Mirror Arena',
      description: 'Synchronized coding challenges',
      icon: RotateCcw,
      color: 'from-green-500 to-emerald-500',
      route: '/battle/mirror-arena'
    },
    {
      id: 'narrative-mode',
      name: 'Narrative Mode',
      description: 'Story-driven coding adventures',
      icon: BookOpen,
      color: 'from-orange-500 to-red-500',
      route: '/battle/narrative-mode'
    },
    {
      id: 'team-clash',
      name: 'Team Clash',
      description: 'Team-based coding competitions',
      icon: Users,
      color: 'from-teal-500 to-cyan-500',
      route: '/battle/team-clash'
    },
    {
      id: 'attack-defend',
      name: 'Attack & Defend',
      description: 'Cybersecurity-themed battles',
      icon: Shield,
      color: 'from-red-500 to-pink-500',
      route: '/battle/attack-defend'
    }
  ];

  const handleModeSelect = (route: string) => {
    setIsOpen(false);
    router.push(route);
  };

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Swords className="w-5 h-5" />
        <span>Battle Modes</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown Menu */}
            <motion.div
              className="absolute top-full mt-2 left-0 min-w-[320px] bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl z-50"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Swords className="w-5 h-5 text-blue-400" />
                  Choose Your Battle
                </h3>
                
                <div className="space-y-2">
                  {battleModes.map((mode) => (
                    <motion.button
                      key={mode.id}
                      onClick={() => handleModeSelect(mode.route)}
                      className="w-full p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 transition-all duration-200 group text-left"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${mode.color} group-hover:scale-110 transition-transform duration-200`}>
                          <mode.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {mode.name}
                          </h4>
                          <p className="text-sm text-gray-400 mt-1">
                            {mode.description}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BattleDropdown;
