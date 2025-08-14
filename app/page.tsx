'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import AnimatedNavbar from '@/components/AnimatedNavbar';
import AnimatedHero from '@/components/AnimatedHero';
import DynamicBattleModes from '@/components/DynamicBattleModes';
import LiveBattles from '@/components/LiveBattles';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-black">
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
            
            {/* Company Description Section */}
            <motion.section 
              className="py-20 px-6 bg-gray-950"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="container mx-auto max-w-4xl">
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-950 to-blue-900 bg-clip-text text-transparent mb-8">
                    About CoderspaE
                  </h2>
                  <div className="text-lg text-gray-300 space-y-6 text-left">
                    <p>
                      <strong className="text-white">CoderspaE</strong> is the world's premier international virtual code battle arena platform, 
                      designed to bring together programmers, developers, and coding enthusiasts from around the globe. 
                      Our mission is to create an engaging, competitive environment where coders can improve their skills, 
                      compete in real-time battles, and connect with a worldwide community of like-minded individuals.
                    </p>
                    
                    <h3 className="text-xl font-bold text-white mt-8 mb-4">What We Offer:</h3>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-3">•</span>
                        <span><strong>Real-time Coding Battles:</strong> Compete with developers worldwide in live programming challenges</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-3">•</span>
                        <span><strong>Team Competitions:</strong> Form teams and participate in multiplayer tournaments</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-3">•</span>
                        <span><strong>Practice Challenges:</strong> Sharpen your skills with our comprehensive challenge library</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-3">•</span>
                        <span><strong>AI-Powered Analytics:</strong> Get personalized insights and improvement recommendations</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-3">•</span>
                        <span><strong>Global Leaderboards:</strong> Track your progress and compete for top rankings</span>
                      </li>
                    </ul>

                    <h3 className="text-xl font-bold text-white mt-8 mb-4">Data Usage & Privacy:</h3>
                    <p>
                      We collect and use your data solely to provide and improve our coding platform services. 
                      This includes your coding performance metrics, battle statistics, and platform usage data 
                      to enhance your learning experience and provide personalized recommendations. 
                      We never share your personal information with third parties without your explicit consent.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
                      <Link 
                        href="/privacy" 
                        className="px-6 py-3 bg-gradient-to-r from-blue-800 to-black hover:bg-gradient-to-r hover:from-black hover:to-blue-800 text-white rounded-lg transition-colors text-center"
                      >
                        Read Our Privacy Policy
                      </Link>
                      <Link 
                        href="/terms" 
                        className="px-12 py-4 bg-gradient-to-r from-gray-950 to-gray-800 text-white font-bold text-lg rounded-2xl hover:from-gray-700 hover:to-gray-950 transition-all duration-300 shadow-2xl text-center"
                      >
                        Terms of Service
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.section>
            
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
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-800 to-blue-950 bg-clip-text text-transparent mb-6">
                    Platform Features
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

            {/* Live Battles Section */}
            <motion.section 
              className="py-20 px-6 bg-gray-950"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="container mx-auto">
                <motion.div 
                  className="text-center mb-12"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-4xl md:text-5xl font-bold bg-white bg-clip-text text-transparent mb-6">
                    Online Matches
                  </h2>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                    Watch live coding battles happening right now or join as a spectator
                  </p>
                </motion.div>
                
                <LiveBattles />
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
                  className="bg-gradient-to-r from-blue-950 to-black backdrop-blur-sm border border-white/10 rounded-3xl p-12 max-w-4xl mx-auto"
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
                    className="px-12 py-4 bg-gradient-to-r from-gray-950 to-gray-800 text-white font-bold text-lg rounded-2xl hover:from-gray-700 hover:to-gray-950 transition-all duration-300 shadow-2xl"
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
