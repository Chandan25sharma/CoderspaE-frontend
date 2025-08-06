'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Users, 
  Target, 
  Code, 
  Globe,
  Heart,
  Zap,
  Trophy,
  Star
} from 'lucide-react';

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Coming Soon',
      role: 'Founder & CEO',
      description: 'Meet our amazing team',
      status: 'coming-soon'
    }
  ];

  const values = [
    {
      icon: Code,
      title: 'Innovation',
      description: 'Pushing the boundaries of competitive programming'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a global network of passionate developers'
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'Striving for the highest quality in everything we do'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'Driven by love for coding and continuous learning'
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
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <Globe className="h-16 w-16 text-blue-400 mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              About CoderspaE
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            The ultimate international virtual code battle arena where developers from around the world 
            compete, learn, and grow together in the art of programming.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <Zap className="w-12 h-12 text-yellow-400" />
              <h2 className="text-3xl font-bold text-white">Our Mission</h2>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              We believe that the best way to improve as a programmer is through real-time competition and 
              collaboration. CoderspaE provides a platform where developers can test their skills, learn 
              from others, and push the boundaries of what&apos;s possible in competitive programming.
            </p>
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-white mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-300 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Features Preview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-white mb-12">What Makes Us Special</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <Trophy className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Real-Time Battles</h3>
              <p className="text-gray-300">
                Experience the thrill of live coding competitions with developers worldwide in real-time battles.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <Users className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Global Community</h3>
              <p className="text-gray-300">
                Join a vibrant community of passionate developers from every corner of the globe.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <Star className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Skill Growth</h3>
              <p className="text-gray-300">
                Improve your coding skills through challenging problems and competitive gameplay.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Meet The Team</h2>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Our Amazing Team</h3>
            <p className="text-gray-300 mb-4">
              We&apos;re working hard to bring you the best coding battle experience
            </p>
            <span className="inline-block px-4 py-2 bg-yellow-500/20 text-yellow-400 text-sm font-medium rounded-full">
              Team Profiles Coming Soon
            </span>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
