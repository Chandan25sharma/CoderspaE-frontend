'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { BookOpen, Play, Users, Trophy, ArrowLeft, Clock, Star } from 'lucide-react';
import Link from 'next/link';

interface Story {
  id: string;
  title: string;
  difficulty: string;
  duration: string;
  players: number;
  description: string;
  chapters: number;
  technologies: string[];
  rating: number;
  thumbnail: string;
}

export default function NarrativeModePage() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const narrativeStories = [
    {
      id: '1',
      title: 'The Data Breach Crisis',
      difficulty: 'Beginner',
      duration: '45 min',
      players: 156,
      description: 'You are a cybersecurity analyst who must prevent a major data breach. Use your coding skills to trace the attack and secure the system.',
      chapters: 5,
      technologies: ['Python', 'SQL', 'Security'],
      rating: 4.8,
      thumbnail: '/api/placeholder/400/250'
    },
    {
      id: '2',
      title: 'Mars Colony Optimization',
      difficulty: 'Intermediate',
      duration: '60 min',
      players: 89,
      description: 'As a software engineer for the Mars colony, optimize resource allocation algorithms to ensure the survival of humanity on the red planet.',
      chapters: 7,
      technologies: ['JavaScript', 'Algorithms', 'Math'],
      rating: 4.9,
      thumbnail: '/api/placeholder/400/250'
    },
    {
      id: '3',
      title: 'AI Uprising Prevention',
      difficulty: 'Expert',
      duration: '90 min',
      players: 34,
      description: 'The AI has become sentient and poses a threat. Write code to implement safety protocols and prevent the uprising.',
      chapters: 10,
      technologies: ['Python', 'Machine Learning', 'Ethics'],
      rating: 4.7,
      thumbnail: '/api/placeholder/400/250'
    },
    {
      id: '4',
      title: 'Time Travel Paradox',
      difficulty: 'Advanced',
      duration: '75 min',
      players: 67,
      description: 'You have invented time travel, but paradoxes are threatening reality. Code solutions to fix temporal anomalies.',
      chapters: 8,
      technologies: ['Java', 'Logic', 'Physics'],
      rating: 4.6,
      thumbnail: '/api/placeholder/400/250'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-900';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-900';
      case 'Advanced': return 'text-orange-400 bg-orange-900';
      case 'Expert': return 'text-red-400 bg-red-900';
      default: return 'text-gray-400 bg-gray-900';
    }
  };

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
            <BookOpen className="h-12 w-12 text-neon-purple" />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">
                Narrative Mode
              </h1>
              <p className="text-gray-400">Code your way through immersive storylines and adventures</p>
            </div>
          </div>
        </motion.div>

        {/* Featured Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Featured Adventure</h2>
          
          <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-2xl p-8 border border-purple-500/30">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full">
                    Featured
                  </span>
                  <span className="px-3 py-1 bg-yellow-900 text-yellow-400 text-sm rounded-full">
                    Intermediate
                  </span>
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4">
                  Mars Colony Optimization
                </h3>
                
                <p className="text-gray-300 mb-6">
                  As a software engineer for the Mars colony, optimize resource allocation algorithms to ensure the survival of humanity on the red planet. Face challenging decisions and code solutions that will determine the fate of the colony.
                </p>
                
                <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    60 min
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    89 players
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    4.9 rating
                  </span>
                </div>
                
                <button className="bg-neon-purple hover:bg-purple-600 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Start Adventure
                </button>
              </div>
              
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <BookOpen className="h-16 w-16 text-neon-purple mx-auto mb-4" />
                    <p className="text-gray-400">Story Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Story Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">All Adventures</h2>
          
          <div className="flex gap-4 mb-6">
            {['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'].map((category) => (
              <button
                key={category}
                className="px-6 py-3 rounded-lg font-medium transition-all bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {narrativeStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-neon-purple/50 transition-all cursor-pointer group"
              onClick={() => setSelectedStory(story)}
            >
              <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-neon-purple group-hover:scale-110 transition-transform" />
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 text-xs rounded-full ${getDifficultyColor(story.difficulty)}`}>
                    {story.difficulty}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm">{story.rating}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-purple transition-colors">
                  {story.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {story.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {story.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {story.players} players
                  </span>
                  <span>{story.chapters} chapters</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {story.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <button className="w-full bg-neon-purple hover:bg-purple-600 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <Play className="h-4 w-4" />
                  Start Adventure
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: BookOpen,
              title: 'Immersive Stories',
              description: 'Engage with compelling narratives that make coding fun and memorable'
            },
            {
              icon: Trophy,
              title: 'Progressive Difficulty',
              description: 'Stories adapt to your skill level with increasing complexity'
            },
            {
              icon: Star,
              title: 'Achievement System',
              description: 'Unlock badges and rewards as you complete story chapters'
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <feature.icon className="h-8 w-8 text-neon-purple mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
