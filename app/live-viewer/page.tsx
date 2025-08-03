'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Monitor, Users, Eye, Play, Settings, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LiveViewerPage() {
  const [activeStream, setActiveStream] = useState('featured');

  const mockStreams = [
    {
      id: '1',
      title: 'CodeClash Championship Finals',
      players: ['AlgoMaster', 'ByteWarrior'],
      viewers: 1247,
      language: 'Python',
      difficulty: 'Expert',
      status: 'live'
    },
    {
      id: '2',
      title: 'Speed Coding Challenge',
      players: ['FastCoder', 'QuickType'],
      viewers: 892,
      language: 'JavaScript',
      difficulty: 'Medium',
      status: 'live'
    },
    {
      id: '3',
      title: 'AI Battle Arena',
      players: ['DeepCode', 'NeuralNet'],
      viewers: 634,
      language: 'Java',
      difficulty: 'Hard',
      status: 'live'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-purple-900 to-cyber-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/battle" className="inline-flex items-center gap-2 text-neon-blue hover:text-blue-400 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Battle Modes
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <Monitor className="h-12 w-12 text-neon-blue" />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                Live Viewer
              </h1>
              <p className="text-gray-400">Watch live coding battles and learn from the best</p>
            </div>
          </div>
        </motion.div>

        {/* Stream Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex gap-4 mb-6">
            {['featured', 'tournaments', 'practice'].map((category) => (
              <button
                key={category}
                onClick={() => setActiveStream(category)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeStream === category
                    ? 'bg-neon-blue text-cyber-dark'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Live Streams Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Main Stream */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-16 w-16 text-neon-blue mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Featured Stream</h3>
                  <p className="text-gray-400">Click to watch live coding battle</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">CodeClash Championship Finals</h3>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-2 text-red-400">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                      LIVE
                    </span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <Eye className="h-4 w-4" />
                      1,247
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>Players: AlgoMaster vs ByteWarrior</span>
                  <span>Language: Python</span>
                  <span>Difficulty: Expert</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stream List */}
          {mockStreams.map((stream, index) => (
            <motion.div
              key={stream.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-neon-blue/50 transition-colors cursor-pointer"
            >
              <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <Play className="h-8 w-8 text-neon-blue" />
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">{stream.title}</h4>
                  <span className="flex items-center gap-1 text-gray-400 text-sm">
                    <Eye className="h-3 w-3" />
                    {stream.viewers}
                  </span>
                </div>
                
                <p className="text-sm text-gray-400 mb-2">
                  {stream.players.join(' vs ')}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{stream.language}</span>
                  <span className="px-2 py-1 bg-red-900 text-red-300 rounded">
                    {stream.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: Eye,
              title: 'Real-time Viewing',
              description: 'Watch coding battles as they happen with live code updates'
            },
            {
              icon: Users,
              title: 'Interactive Chat',
              description: 'Engage with other viewers and discuss strategies'
            },
            {
              icon: Settings,
              title: 'Multiple Views',
              description: 'Switch between different camera angles and code views'
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <feature.icon className="h-8 w-8 text-neon-blue mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
