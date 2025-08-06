'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedNavbar from '@/components/AnimatedNavbar';
import AnimatedHero from '@/components/AnimatedHero';
import DynamicBattleModes from '@/components/DynamicBattleModes';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  const [showBattleModes, setShowBattleModes] = useState(false);

  const handleEnterBattle = () => {
    setShowBattleModes(true);
  };

  const handleBackToHome = () => {
    setShowBattleModes(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
      <AnimatedNavbar />
      
      <AnimatePresence mode="wait">
        {!showBattleModes ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatedHero onEnterBattle={handleEnterBattle} />
            
            {/* Features Section */}
            <motion.section 
              className="py-20 px-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="container mx-auto">
                <motion.div 
                  className="text-center mb-16"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
                    Why Choose CoderspaE?
                  </h2>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                    Experience the future of competitive programming with our cutting-edge platform
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      title: 'Real-Time Battles',
                      description: 'Compete with developers worldwide in live coding challenges',
                      icon: '⚡',
                      gradient: 'from-yellow-400 to-orange-500'
                    },
                    {
                      title: 'AI-Powered Insights',
                      description: 'Get personalized feedback and improvement suggestions',
                      icon: '🤖',
                      gradient: 'from-blue-400 to-cyan-500'
                    },
                    {
                      title: 'Team Competitions',
                      description: 'Form teams and compete in epic multiplayer tournaments',
                      icon: '👥',
                      gradient: 'from-purple-400 to-pink-500'
                    },
                    {
                      title: 'Global Leaderboards',
                      description: 'Climb the ranks and showcase your coding prowess',
                      icon: '🏆',
                      gradient: 'from-emerald-400 to-green-500'
                    },
                    {
                      title: 'Multiple Languages',
                      description: 'Code in your favorite programming language',
                      icon: '📝',
                      gradient: 'from-red-400 to-pink-500'
                    },
                    {
                      title: 'Achievement System',
                      description: 'Unlock badges, titles, and exclusive rewards',
                      icon: '🎖️',
                      gradient: 'from-amber-400 to-yellow-500'
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <motion.div
                        className={`text-4xl mb-4 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {feature.icon}
                      </motion.div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section 
              className="py-20 px-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="container mx-auto text-center">
                <motion.div
                  className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-3xl p-12 max-w-4xl mx-auto"
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
                    Ready to Start Your Journey?
                  </h2>
                  <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                    Join thousands of developers who are already sharpening their skills and climbing the leaderboards
                  </p>
                  <motion.button
                    onClick={handleEnterBattle}
                    className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Enter Battle Arena
                  </motion.button>
                </motion.div>
              </div>
            </motion.section>

            <Footer />
          </motion.div>
        ) : (
          <motion.div
            key="battle-modes"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            {/* Back Button */}
            <motion.button
              onClick={handleBackToHome}
              className="fixed top-20 left-6 z-50 px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Back to Home
            </motion.button>
            
            <DynamicBattleModes />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
