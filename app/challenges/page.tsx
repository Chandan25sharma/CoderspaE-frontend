'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Code, 
  Target, 
  Trophy,
  Zap,
  Clock,
  Users,
  Brain,
  Settings
} from 'lucide-react';

export default function ChallengesPage() {
  const challengeCategories = [
    {
      title: 'Algorithm Challenges',
      icon: Brain,
      description: 'Master fundamental algorithms and data structures',
      status: 'coming-soon',
      difficulty: 'Beginner to Expert',
      count: '200+ Challenges'
    },
    {
      title: 'Speed Coding',
      icon: Zap,
      description: 'Test your coding speed with time-based challenges',
      status: 'coming-soon',
      difficulty: 'Intermediate',
      count: '50+ Challenges'
    },
    {
      title: 'System Design',
      icon: Settings,
      description: 'Practice large-scale system architecture problems',
      status: 'coming-soon',
      difficulty: 'Advanced',
      count: '30+ Challenges'
    },
    {
      title: 'Competition Prep',
      icon: Trophy,
      description: 'Prepare for programming contests and interviews',
      status: 'coming-soon',
      difficulty: 'All Levels',
      count: '100+ Challenges'
    }
  ];

  const features = [
    {
      icon: Target,
      title: 'Skill-based Matching',
      description: 'Challenges adapted to your current skill level'
    },
    {
      icon: Clock,
      title: 'Timed Practice',
      description: 'Improve your speed with time-limited challenges'
    },
    {
      icon: Users,
      title: 'Community Solutions',
      description: 'Learn from other developers\' solutions'
    },
    {
      icon: Trophy,
      title: 'Achievement System',
      description: 'Unlock badges and track your progress'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation Header */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors group">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <Code className="h-16 w-16 text-green-400 mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-400 bg-clip-text text-transparent">
              Practice Challenges
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Sharpen your coding skills with our comprehensive collection of practice challenges. 
            From algorithms to system design, we&apos;ve got everything you need to level up.
          </p>
        </motion.div>

        {/* Coming Soon Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-8 text-center mb-12"
        >
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Practice Challenges Coming Soon!</h2>
          <p className="text-gray-300 mb-6">
            We&apos;re working hard to bring you an amazing collection of coding challenges. 
            In the meantime, you can participate in live battles and tournaments!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/battle" className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Zap className="w-5 h-5 mr-2" />
              Try Live Battles
            </Link>
            <Link href="/tournament" className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
              <Trophy className="w-5 h-5 mr-2" />
              View Tournaments
            </Link>
          </div>
        </motion.div>

        {/* Challenge Categories Preview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-white mb-12">Challenge Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {challengeCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-white">{category.title}</h3>
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full">
                        Coming Soon
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">{category.description}</p>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{category.difficulty}</span>
                  <span>{category.count}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center text-white mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center hover:border-green-500/50 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
