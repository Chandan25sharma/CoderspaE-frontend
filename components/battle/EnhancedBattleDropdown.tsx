'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ChevronDown, 
  Zap, 
  Brain, 
  RotateCcw, 
  BookOpen, 
  Users, 
  Shield,
  Swords,
  MonitorPlay,
  Crown,
  Flame,
  Trophy,
  UserPlus
} from 'lucide-react';

// Import new components
import SingleChallengeModal from '../challenge/SingleChallengeModal';
import TeamChallengeModal from '../challenge/TeamChallengeModal';
import QuickLobby from '../lobby/QuickLobby';

interface BattleMode {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  route: string;
  type: 'single' | 'team' | 'spectate';
  quickMatch?: boolean;
  features: string[];
}

interface BattleDropdownProps {
  className?: string;
}

interface BattleModeStats {
  activeBattles: number;
  onlineUsers: number;
  isPopular?: boolean;
}

const EnhancedBattleDropdown: React.FC<BattleDropdownProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState<Record<string, BattleModeStats>>({});
  const [showQuickLobby, setShowQuickLobby] = useState(false);
  const [showSingleChallenge, setShowSingleChallenge] = useState(false);
  const [showTeamChallenge, setShowTeamChallenge] = useState(false);
  const [quickLobbyMode, setQuickLobbyMode] = useState<{
    battleMode: string;
    type: 'single' | 'team';
  } | null>(null);
  
  const router = useRouter();

  const battleModes: BattleMode[] = [
    {
      id: 'live-battles',
      name: 'Live Battles',
      description: 'Watch and join live coding battles',
      icon: MonitorPlay,
      color: 'from-red-500 to-orange-500',
      route: '/battle/live',
      type: 'spectate',
      features: ['Live Streaming', 'Real-time Chat', 'Multiple Rooms']
    },
    {
      id: 'quick-dual',
      name: 'Quick Dual (1v1)',
      description: 'Fast-paced 1v1 coding battles',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      route: '/battle/quick-dual',
      type: 'single',
      quickMatch: true,
      features: ['Instant Matchmaking', '15-60 min battles', 'Skill-based pairing']
    },
    {
      id: 'minimalist-mind',
      name: 'Minimalist Mind',
      description: 'Code with minimal UI distractions',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      route: '/battle/minimalist-mind',
      type: 'single',
      quickMatch: true,
      features: ['Clean Interface', 'Focus Mode', 'Zen Coding']
    },
    {
      id: 'mirror-arena',
      name: 'Mirror Arena',
      description: 'Synchronized coding challenges',
      icon: RotateCcw,
      color: 'from-green-500 to-emerald-500',
      route: '/battle/mirror-arena',
      type: 'single',
      quickMatch: true,
      features: ['Mirror Problems', 'Same Start Time', 'Fair Competition']
    },
    {
      id: 'narrative-mode',
      name: 'Narrative Mode',
      description: 'Story-driven coding adventures',
      icon: BookOpen,
      color: 'from-orange-500 to-red-500',
      route: '/battle/narrative-mode',
      type: 'single',
      features: ['Story Campaign', 'Progressive Difficulty', 'Achievements']
    },
    {
      id: 'team-clash',
      name: 'Team Clash',
      description: 'Team-based coding competitions',
      icon: Users,
      color: 'from-teal-500 to-cyan-500',
      route: '/battle/team-clash',
      type: 'team',
      quickMatch: true,
      features: ['2-8 Players per Team', 'Collaborative Coding', 'Team Rankings']
    },
    {
      id: 'attack-defend',
      name: 'Attack & Defend',
      description: 'Cybersecurity-themed battles',
      icon: Shield,
      color: 'from-red-500 to-pink-500',
      route: '/battle/attack-defend',
      type: 'team',
      quickMatch: true,
      features: ['Security Challenges', 'Offensive vs Defensive', 'CTF Style']
    }
  ];

  useEffect(() => {
    // Fetch battle mode statistics
    fetchBattleModeStats();
    
    // Update stats every 30 seconds
    const interval = setInterval(fetchBattleModeStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchBattleModeStats = async () => {
    try {
      const response = await fetch('/api/battles/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch battle stats:', error);
    }
  };

  const handleModeSelect = (mode: BattleMode) => {
    setIsOpen(false);
    
    if (mode.type === 'spectate') {
      router.push(mode.route);
    } else if (mode.quickMatch) {
      // Show quick match option
      setQuickLobbyMode({
        battleMode: mode.name,
        type: mode.type as 'single' | 'team'
      });
      setShowQuickLobby(true);
    } else {
      router.push(mode.route);
    }
  };

  const handleQuickMatch = (mode: BattleMode) => {
    setQuickLobbyMode({
      battleMode: mode.name,
      type: mode.type as 'single' | 'team'
    });
    setShowQuickLobby(true);
    setIsOpen(false);
  };

  return (
    <>
      <div className={`relative ${className}`}>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Swords className="w-5 h-5" />
          <span>Battle Modes</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
              />
              
              {/* Dropdown Menu */}
              <motion.div
                className="absolute top-full mt-2 left-0 min-w-[420px] bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl z-50"
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <Swords className="w-5 h-5 text-blue-400" />
                    Choose Your Battle
                    <Crown className="w-4 h-4 text-yellow-400" />
                  </h3>
                  
                  <div className="space-y-3">
                    {battleModes.map((mode) => {
                      const modeStats = stats[mode.id] || { activeBattles: 0, onlineUsers: 0 };
                      return (
                        <motion.div
                          key={mode.id}
                          className="group relative"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 transition-all duration-200">
                            {/* Mode Icon */}
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${mode.color} group-hover:scale-110 transition-transform duration-200`}>
                              <mode.icon className="w-5 h-5 text-white" />
                            </div>

                            {/* Mode Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                                  {mode.name}
                                </h4>
                                {modeStats.isPopular && (
                                  <Flame className="w-4 h-4 text-orange-400" />
                                )}
                              </div>
                              <p className="text-sm text-gray-400 mb-2">
                                {mode.description}
                              </p>
                              
                              {/* Features */}
                              <div className="flex flex-wrap gap-1 mb-2">
                                {mode.features.slice(0, 2).map((feature, index) => (
                                  <span key={index} className="px-2 py-1 bg-gray-700/50 text-xs text-gray-300 rounded">
                                    {feature}
                                  </span>
                                ))}
                              </div>

                              {/* Stats */}
                              <div className="flex items-center gap-4 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Trophy className="w-3 h-3" />
                                  {modeStats.activeBattles} active
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {modeStats.onlineUsers} online
                                </span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => handleModeSelect(mode)}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                              >
                                {mode.type === 'spectate' ? 'Watch' : 'Enter'}
                              </button>
                              
                              {mode.quickMatch && (
                                <button
                                  onClick={() => handleQuickMatch(mode)}
                                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                                >
                                  <Zap className="w-3 h-3" />
                                  Quick
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-300 font-medium">Challenge Friends</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setShowSingleChallenge(true);
                            setIsOpen(false);
                          }}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                        >
                          <UserPlus className="w-3 h-3" />
                          1v1 Challenge
                        </button>
                        <button
                          onClick={() => {
                            setShowTeamChallenge(true);
                            setIsOpen(false);
                          }}
                          className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Users className="w-3 h-3" />
                          Team Challenge
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>Need help choosing?</span>
                      <button 
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        onClick={() => router.push('/help/battle-modes')}
                      >
                        View Guide
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Lobby Modal */}
      {showQuickLobby && quickLobbyMode && (
        <QuickLobby
          isOpen={showQuickLobby}
          onClose={() => {
            setShowQuickLobby(false);
            setQuickLobbyMode(null);
          }}
          battleMode={quickLobbyMode.battleMode}
          type={quickLobbyMode.type}
          // teamData would be passed if type is 'team' and user has a team
        />
      )}

      {/* Single Challenge Modal */}
      {showSingleChallenge && (
        <SingleChallengeModal
          isOpen={showSingleChallenge}
          onClose={() => setShowSingleChallenge(false)}
          targetUser={{
            id: '',
            username: 'Select a user',
            avatar: '',
            totalPoints: 0,
            wins: 0,
            losses: 0
          }}
          battleMode="Quick Dual (1v1)"
          problems={[]}
        />
      )}

      {/* Team Challenge Modal */}
      {showTeamChallenge && (
        <TeamChallengeModal
          isOpen={showTeamChallenge}
          onClose={() => setShowTeamChallenge(false)}
          targetTeam={{
            id: '',
            name: 'Select a team',
            leader: {
              id: '',
              username: 'Team Leader',
              avatar: ''
            },
            members: [],
            stats: {
              wins: 0,
              losses: 0,
              totalBattles: 0
            }
          }}
          challengerTeam={{
            id: 'temp-team-id',
            name: 'Your Team',
            members: []
          }}
          battleMode="Team Clash"
          problems={[]}
        />
      )}
    </>
  );
};

export default EnhancedBattleDropdown;
