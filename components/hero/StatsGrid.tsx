'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Zap, 
  Trophy, 
  Crown
} from 'lucide-react';

const StatsGrid: React.FC = () => {
  const stats = [
    { icon: Users, label: 'Active Players', value: '50+', color: 'from-blue-950 to-cyan-400' },
    { icon: Zap, label: 'Battles Today', value: '100+', color: 'from-purple-950 to-pink-700' },
    { icon: Trophy, label: 'Tournaments', value: '10+', color: 'from-yellow-950 to-orange-400' },
    { icon: Crown, label: 'Champions', value: '99+', color: 'from-emerald-950 to-green-400' },
  ];

  return (
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
    >
      {stats.map((stat, index) => (
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
  );
};

export default StatsGrid;
