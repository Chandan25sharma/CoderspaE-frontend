'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft, 
  HelpCircle, 
  MessageCircle, 
  Book, 
  Mail, 
  ExternalLink,
  FileText,
  Users,
  Zap
} from 'lucide-react';

export default function HelpPage() {
  const helpSections = [
    {
      title: 'Getting Started',
      icon: Book,
      description: 'Learn the basics of CoderspaE',
      status: 'available',
      items: [
        'How to create an account',
        'Setting up your profile',
        'Understanding the interface',
        'Your first battle'
      ]
    },
    {
      title: 'Battle System',
      icon: Zap,
      description: 'Master the art of coding battles',
      status: 'coming-soon',
      items: [
        'Battle types and modes',
        'Scoring system',
        'Time management',
        'Best practices'
      ]
    },
    {
      title: 'Community',
      icon: Users,
      description: 'Connect with other developers',
      status: 'coming-soon',
      items: [
        'Team formation',
        'Community guidelines',
        'Forums and discussions',
        'Events and meetups'
      ]
    },
    {
      title: 'Technical Support',
      icon: HelpCircle,
      description: 'Troubleshooting and technical help',
      status: 'available',
      items: [
        'Common issues',
        'Browser compatibility',
        'Performance optimization',
        'Contact support'
      ]
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
            <HelpCircle className="h-16 w-16 text-blue-400 mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Help & Support
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Get help, find answers, and learn everything you need to know about CoderspaE
          </p>
        </motion.div>

        {/* Help Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {helpSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white">{section.title}</h3>
                    {section.status === 'coming-soon' && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm mb-4">{section.description}</p>
                </div>
              </div>
              
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center text-gray-400 text-sm">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Quick Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center"
        >
          <MessageCircle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Need More Help?</h2>
          <p className="text-gray-300 mb-6">
            Can't find what you're looking for? Our support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@coderspae.com" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Mail className="w-5 h-5 mr-2" />
              Email Support
            </a>
            <Link 
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <FileText className="w-5 h-5 mr-2" />
              Contact Form
              <span className="ml-2 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                Coming Soon
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
