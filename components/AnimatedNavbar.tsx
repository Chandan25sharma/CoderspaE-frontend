'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { 
  Trophy, 
  Users, 
  Settings, 
  User,
  Menu,
  X,
  Crown,
  Zap,
  Target,
  ChevronDown,
  LogOut
} from 'lucide-react';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Battle', href: '/battle', icon: Zap, hasDropdown: true },
    { name: 'Tournament', href: '/tournament', icon: Trophy },
    { name: 'Practice', href: '/practice', icon: Target },
    { name: 'Teams', href: '/teams', icon: Users },
    { name: 'Leaderboard', href: '/leaderboard', icon: Crown },
  ];

  const battleModes = [
    { name: 'Quick Duel', href: '/battle/quick', description: '1v1 battles' },
    { name: 'Team Clash', href: '/battle/team', description: 'Team battles' },
    { name: 'Tournament', href: '/tournament', description: 'Competitive events' },
    { name: 'Practice', href: '/practice', description: 'Skill training' },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 50 
          ? 'bg-gray-900/95 backdrop-blur-lg border-b border-white/10' 
          : 'bg-transparent'
      } ${className}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div 
              className="flex items-center space-x-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="w-10 h-10 bg-gradient-to-br rounded-xl flex items-center justify-center relative overflow-hidden"
                whileHover={{ rotate: 10 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/icon.png"
                  alt="CoderspaE Icon"
                  width={220}
                  height={200}
                  className="object-contain"
                />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CoderspaE
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <div key={item.name} className="relative group">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={item.href}>
                    <motion.div
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors cursor-pointer py-2 px-3 rounded-lg hover:bg-white/10"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                      {item.hasDropdown && (
                        <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
                      )}
                    </motion.div>
                  </Link>
                </motion.div>

                {/* Dropdown for Battle */}
                {item.hasDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800/95 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                        Battle Modes
                      </h3>
                      {battleModes.map((mode) => (
                        <Link key={mode.name} href={mode.href}>
                          <motion.div
                            className="flex flex-col p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                            whileHover={{ x: 5 }}
                          >
                            <span className="text-white font-medium">{mode.name}</span>
                            <span className="text-gray-400 text-sm">{mode.description}</span>
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {session ? (
              <div className="relative">
                <motion.button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl p-2 pr-4 hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-medium hidden sm:block">
                    {session.user?.name || 'User'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                    >
                      <div className="p-2">
                        <Link href="/profile">
                          <motion.div
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                            whileHover={{ x: 5 }}
                          >
                            <User className="w-5 h-5 text-gray-400" />
                            <span className="text-white">Profile</span>
                          </motion.div>
                        </Link>
                        <Link href="/settings">
                          <motion.div
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                            whileHover={{ x: 5 }}
                          >
                            <Settings className="w-5 h-5 text-gray-400" />
                            <span className="text-white">Settings</span>
                          </motion.div>
                        </Link>
                        <motion.button
                          onClick={() => signOut()}
                          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-500/20 cursor-pointer transition-colors"
                          whileHover={{ x: 5 }}
                        >
                          <LogOut className="w-5 h-5 text-red-400" />
                          <span className="text-red-400">Sign Out</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/signin">
                  <motion.button
                    className="px-6 py-2 text-gray-300 hover:text-white transition-colors font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign In
                  </motion.button>
                </Link>
                <Link href="/auth/signup">
                  <motion.button
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started
                  </motion.button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 overflow-hidden"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={item.href}>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-colors">
                        <item.icon className="w-5 h-5 text-gray-400" />
                        <span className="text-white font-medium">{item.name}</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
