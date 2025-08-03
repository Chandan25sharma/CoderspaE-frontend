'use client';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Menu, X, Swords, Trophy, Users, LogOut, User, Shield, Target, Brain, Zap, Eye, Scroll } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';

export function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const battleModes = [
    { href: '/mirror-arena', icon: Target, label: 'Mirror Arena', description: 'Real-time dual language battles' },
    { href: '/minimalist-mind', icon: Brain, label: 'Minimalist Mind', description: 'Optimize code for efficiency' },
    { href: '/code-arena', icon: Zap, label: 'Code Arena', description: 'Power-up enhanced battles' },
    { href: '/attack-defend', icon: Shield, label: 'Attack & Defend', description: 'Break code vs test cases' },
    { href: '/narrative-mode', icon: Scroll, label: 'Narrative Mode', description: 'Story-driven challenges' },
    { href: '/live-viewer', icon: Eye, label: 'Live Viewer', description: 'Spectate and vote on battles' },
  ];

  return (
    <nav className="bg-cyber-gray/90 backdrop-blur-sm border-b border-neon-blue/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Swords className="h-8 w-8 text-neon-blue" />
            <span className="text-2xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green bg-clip-text text-transparent">
              CoderspaE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="text-gray-300 hover:text-neon-blue px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              
              {/* Battle Modes Dropdown - Always visible */}
              <div className="relative group">
                <button className="text-gray-300 hover:text-neon-red px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1">
                  <Swords className="h-4 w-4" />
                  <span>Battle Modes</span>
                </button>
                <div className="absolute left-0 top-full mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2 space-y-1">
                    {battleModes.map((mode) => (
                      <Link
                        key={mode.href}
                        href={mode.href}
                        className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-800 transition-colors group/item"
                      >
                        <mode.icon className="h-5 w-5 text-purple-400 group-hover/item:text-purple-300" />
                        <div>
                          <div className="font-medium text-white">{mode.label}</div>
                          <div className="text-xs text-gray-400">{mode.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href="/practice"
                className="text-gray-300 hover:text-neon-green px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
              >
                <Target className="h-4 w-4" />
                <span>Practice</span>
              </Link>
              <Link
                href="/teams"
                className="text-gray-300 hover:text-neon-purple px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
              >
                <Users className="h-4 w-4" />
                <span>Teams</span>
              </Link>
              <Link
                href="/tournament"
                className="text-gray-300 hover:text-neon-yellow px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
              >
                <Trophy className="h-4 w-4" />
                <span>Tournaments</span>
              </Link>
              <Link
                href="/leaderboard"
                className="text-gray-300 hover:text-neon-yellow px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
              >
                <Trophy className="h-4 w-4" />
                <span>Leaderboard</span>
              </Link>
              
              {/* User-specific pages - only show when logged in */}
              {session && (
                <>
                  <Link
                    href="/profile"
                    className="text-gray-300 hover:text-neon-blue px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  {/* Only show Admin link for admin users */}
                  {session?.user?.email === 'chandan@coderspae.com' && (
                    <Link
                      href="/admin"
                      className="text-gray-300 hover:text-neon-purple px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
                    >
                      <Shield className="h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Authentication */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {/* Theme Switcher */}
              <ThemeSwitcher />
              
              {status === 'loading' ? (
                <div className="animate-pulse bg-gray-600 h-8 w-8 rounded-full"></div>
              ) : session ? (
                <div className="flex items-center space-x-3">
                  {/* User Icon Only */}
                  <div className="relative group">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || ''}
                        className="h-9 w-9 rounded-full border-2 border-neon-blue/30 hover:border-neon-blue/60 transition-all cursor-pointer"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center border-2 border-neon-blue/30 hover:border-neon-blue/60 transition-all cursor-pointer">
                        <span className="text-white text-sm font-semibold">
                          {session.user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                    
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      <div className="text-center">
                        <p className="font-medium">{session.user.name}</p>
                        <p className="text-neon-blue text-xs">Rating: {session.user.rating || 1000}</p>
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center space-x-1 bg-red-600/80 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-red-500/30"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="bg-neon-blue hover:bg-blue-600 text-cyber-dark px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-white focus:outline-none focus:text-white"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-cyber-gray">
            <Link
              href="/"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            {/* Battle Modes - Always visible in mobile */}
            {battleModes.map((mode) => (
              <Link
                key={mode.href}
                href={mode.href}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {mode.label}
              </Link>
            ))}
            
            <Link
              href="/practice"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Practice
            </Link>
            <Link
              href="/teams"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Teams
            </Link>
            <Link
              href="/tournament"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Tournaments
            </Link>
            <Link
              href="/leaderboard"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Leaderboard
            </Link>
            
            {/* User-specific pages in mobile - only show when logged in */}
            {session && (
              <>
                <Link
                  href="/profile"
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                {/* Only show Admin link for admin users in mobile */}
                {session?.user?.email === 'chandan@coderspae.com' && (
                  <Link
                    href="/admin"
                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
            
            <div className="border-t border-gray-600 pt-4">
              {session ? (
                <button
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="text-red-400 hover:text-red-300 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    signIn();
                    setIsMenuOpen(false);
                  }}
                  className="text-neon-blue hover:text-blue-300 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
