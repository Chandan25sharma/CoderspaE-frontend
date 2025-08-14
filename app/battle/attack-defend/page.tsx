'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sword, Shield, Eye, Zap, Clock, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Battle {
  _id: string;
  battleId: string;
  mode: string;
  title: string;
  participants: Array<{
    user: {
      username: string;
      displayName: string;
      avatar: string;
      isOnline: boolean;
    };
    team: string;
    score: number;
    rank: number;
  }>;
  spectators: Array<{
    userId: string;
    username: string;
    displayName: string;
  }>;
  status: string;
  startTime?: string;
  timeLimit: number;
  isLive: boolean;
}

interface User {
  _id: string;
  username: string;
  displayName: string;
  avatar: string;
  totalPoints: number;
  rank: number;
  tier: string;
  isOnline: boolean;
  battleStats: {
    attackDefendStats: {
      played: number;
      won: number;
      points: number;
    };
  };
}

const AttackDefendPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [liveBattles, setLiveBattles] = useState<Battle[]>([]);
  const [topPlayers, setTopPlayers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock current user data - replace with actual auth
  const currentUser = {
    attackWins: 24,
    defenseWins: 18,
    totalBattles: 50,
    winRate: 84,
    rank: 156,
    energyPoints: 2850
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch live Attack & Defend battles
      const battlesResponse = await fetch('/api/battles?mode=attack-defend&status=live');
      const battlesData = await battlesResponse.json();
      
      if (battlesData.success) {
        setLiveBattles(battlesData.battles || []);
      }

      // Fetch top Attack & Defend players
      const usersResponse = await fetch('/api/users?battleMode=attack-defend&limit=10');
      const usersData = await usersResponse.json();
      
      if (usersData.success) {
        setTopPlayers(usersData.users || []);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const createBattle = async () => {
    try {
      if (!session?.user?.email) {
        router.push('/auth/signin');
        return;
      }

      const response = await fetch('/api/battles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'attack-defend',
          battleMode: 'Attack & Defend',
          timeLimit: 25,
          settings: {
            cameraRequired: true,
            voiceEnabled: false,
            allowSpectators: true,
            maxSpectators: 100
          }
        }),
      });

      const data = await response.json();
      if (data.success) {
        router.push(`/battle/attack-defend/${data.battle._id}`);
      } else {
        console.error('Failed to create battle:', data.error);
      }
    } catch (error) {
      console.error('Error creating battle:', error);
    }
  };

  const joinBattle = async (battleId: string) => {
    try {
      const response = await fetch(`/api/battles/${battleId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'currentUserId', // Replace with actual user ID
          action: 'join'
        }),
      });

      const data = await response.json();
      if (data.success) {
        router.push(`/battle/attack-defend/${battleId}`);
      }
    } catch (error) {
      console.error('Error joining battle:', error);
    }
  };

  const spectateeBattle = (battleId: string) => {
    router.push(`/battle/attack-defend/${battleId}?mode=spectator`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-950 via-slate-900 to-red-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-400 mx-auto"></div>
          <p className="text-white mt-4">Loading Attack & Defend Arena...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-slate-900 to-red-950 text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-red-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Sword className="w-8 h-8 text-red-400" />
                  <Shield className="w-6 h-6 text-blue-400 absolute -bottom-1 -right-1" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                    Attack & Defend
                  </h1>
                  <p className="text-sm text-gray-400">Cybersecurity-themed code battles</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={createBattle}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105"
              >
                Create Battle
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded-lg font-medium transition-colors">
                Join Random
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel: Live Battles */}
          <div className="lg:col-span-1">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-red-500/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-red-400">Live Battles</h2>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-400">LIVE</span>
                </div>
              </div>
              
              {error ? (
                <div className="text-center py-8">
                  <p className="text-red-400 mb-4">{error}</p>
                  <button
                    onClick={fetchData}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : liveBattles.length === 0 ? (
                <div className="text-center py-8">
                  <Sword className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No live battles</p>
                  <p className="text-sm text-gray-500 mt-2">Create one to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {liveBattles.map((battle) => (
                    <motion.div
                      key={battle._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-900/30 rounded-lg p-4 border border-red-500/30 hover:border-red-400/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Sword className="w-4 h-4 text-red-400" />
                          <span className="font-medium text-sm">{battle.title}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{battle.timeLimit}m</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex space-x-2">
                          {battle.participants.map((participant, index) => (
                            <div key={index} className="flex items-center space-x-1">
                              <div className={`w-2 h-2 rounded-full ${
                                participant.team === 'A' ? 'bg-red-400' : 'bg-blue-400'
                              }`}></div>
                              <span className="text-xs text-gray-300">
                                {participant.user.displayName}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <Eye className="w-3 h-3" />
                          <span>{battle.spectators.length}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => joinBattle(battle._id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-xs font-medium transition-colors"
                        >
                          Join Battle
                        </button>
                        <button
                          onClick={() => spectateeBattle(battle._id)}
                          className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-xs font-medium transition-colors"
                        >
                          Watch
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center Panel: Stats & Features */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Personal Stats */}
              <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-red-500/20 p-6">
                <h2 className="text-xl font-bold text-red-400 mb-6">Your Attack & Defend Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-red-900/30 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Sword className="w-6 h-6 text-red-400" />
                    </div>
                    <div className="text-2xl font-bold text-red-400">{currentUser.attackWins}</div>
                    <div className="text-sm text-gray-400">Attack Wins</div>
                  </div>
                  <div className="text-center p-4 bg-blue-900/30 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Shield className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-blue-400">{currentUser.defenseWins}</div>
                    <div className="text-sm text-gray-400">Defense Wins</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-white">{currentUser.winRate}%</div>
                    <div className="text-sm text-gray-400">Win Rate</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400">#{currentUser.rank}</div>
                    <div className="text-sm text-gray-400">Global Rank</div>
                  </div>
                </div>
              </div>

              {/* Game Modes Info */}
              <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-red-500/20 p-6">
                <h3 className="text-lg font-bold text-red-400 mb-4">How to Play</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Sword className="w-5 h-5 text-red-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-red-300">Attacker</div>
                      <div className="text-sm text-gray-400">Send coding challenges to overwhelm defender</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-300">Defender</div>
                      <div className="text-sm text-gray-400">Solve problems quickly to block attacks</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Zap className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-yellow-300">Energy System</div>
                      <div className="text-sm text-gray-400">Earn energy to deploy special attacks</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Leaderboard */}
          <div className="lg:col-span-1">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-red-500/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-red-400">Attack & Defend Champions</h2>
                <Trophy className="w-6 h-6 text-yellow-400" />
              </div>
              
              {topPlayers.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No champions yet</p>
                  <p className="text-sm text-gray-500 mt-2">Be the first to claim the throne!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {topPlayers.map((player, index) => (
                    <motion.div
                      key={player._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center space-x-3 p-3 rounded-lg ${
                        index === 0 ? 'bg-yellow-900/30 border border-yellow-500/30' :
                        index === 1 ? 'bg-gray-800/30 border border-gray-500/30' :
                        index === 2 ? 'bg-orange-900/30 border border-orange-500/30' :
                        'bg-gray-900/30'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500 text-black' :
                        index === 1 ? 'bg-gray-400 text-black' :
                        index === 2 ? 'bg-orange-500 text-black' :
                        'bg-gray-700 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white">{player.displayName}</div>
                        <div className="text-sm text-gray-400">
                          {player.battleStats?.attackDefendStats?.points || 0} points • {player.tier}
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        player.isOnline ? 'bg-green-400' : 'bg-gray-600'
                      }`}></div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttackDefendPage;
