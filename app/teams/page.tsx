'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Users, Plus, Crown, Trophy, Target, Star, Search } from 'lucide-react';
import { AnimatedBadge } from '@/components/AnimatedBadge';

interface Team {
  id: string;
  name: string;
  members: Array<{
    id: string;
    name: string;
    role: 'leader' | 'member';
    rating: number;
    avatar?: string;
  }>;
  wins: number;
  losses: number;
  rating: number;
  description: string;
  isJoinable: boolean;
}

const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Code Crushers',
    members: [
      { id: '1', name: 'Alex Chen', role: 'leader', rating: 1850 },
      { id: '2', name: 'Sarah Kim', role: 'member', rating: 1720 },
      { id: '3', name: 'Mike Johnson', role: 'member', rating: 1680 },
    ],
    wins: 45,
    losses: 12,
    rating: 1750,
    description: 'Elite team specializing in algorithmic challenges',
    isJoinable: false,
  },
  {
    id: '2',
    name: 'Binary Bombers',
    members: [
      { id: '4', name: 'Emma Wilson', role: 'leader', rating: 1650 },
      { id: '5', name: 'David Lee', role: 'member', rating: 1580 },
    ],
    wins: 28,
    losses: 8,
    rating: 1615,
    description: 'Fast-paced team focused on speed coding',
    isJoinable: true,
  },
];

export default function TeamsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');

  const filteredTeams = mockTeams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTeam = () => {
    // TODO: Implement team creation logic
    console.log('Creating team:', { name: newTeamName, description: newTeamDescription });
    setShowCreateModal(false);
    setNewTeamName('');
    setNewTeamDescription('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="h-12 w-12 text-neon-blue" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-neon-blue to-neon-green bg-clip-text text-transparent">
              Teams Arena
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join forces with other developers or create your own team to dominate the coding battlefield
          </p>
        </motion.div>

        {/* Search and Create */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-cyber-gray border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 transition-all"
            />
          </div>
          <motion.button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-neon-green to-neon-blue text-white font-semibold rounded-xl shadow-lg hover:shadow-neon-green/50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="h-5 w-5 inline mr-2" />
            Create Team
          </motion.button>
        </motion.div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team, index) => (
            <motion.div
              key={team.id}
              className="bg-cyber-gray rounded-2xl p-6 border border-gray-700 hover:border-neon-blue/50 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Team Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{team.name}</h3>
                <div className="flex items-center gap-2">
                  <AnimatedBadge 
                    type={team.rating > 1700 ? 'gold' : team.rating > 1500 ? 'silver' : 'bronze'}
                    category="wins"
                    level={Math.floor(team.rating / 100)}
                    size="sm"
                  />
                </div>
              </div>

              {/* Team Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-green">{team.wins}</div>
                  <div className="text-xs text-gray-400">Wins</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-red">{team.losses}</div>
                  <div className="text-xs text-gray-400">Losses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-yellow">{team.rating}</div>
                  <div className="text-xs text-gray-400">Rating</div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm mb-4">{team.description}</p>

              {/* Members */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-400 mb-2">Members ({team.members.length}/4)</h4>
                <div className="space-y-2">
                  {team.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {member.role === 'leader' && <Crown className="h-4 w-4 text-neon-yellow" />}
                        <span className="text-white text-sm">{member.name}</span>
                      </div>
                      <span className="text-gray-400 text-xs">{member.rating}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  team.isJoinable
                    ? 'bg-neon-green text-cyber-dark hover:bg-green-400'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!team.isJoinable}
                whileHover={team.isJoinable ? { scale: 1.02 } : {}}
                whileTap={team.isJoinable ? { scale: 0.98 } : {}}
              >
                {team.isJoinable ? 'Request to Join' : 'Team Full'}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Create Team Modal */}
        {showCreateModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-cyber-gray rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-700"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Create New Team</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Team Name
                  </label>
                  <input
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="w-full px-4 py-3 bg-cyber-light border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 transition-all"
                    placeholder="Enter team name..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTeamDescription}
                    onChange={(e) => setNewTeamDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-cyber-light border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 transition-all resize-none"
                    placeholder="Describe your team..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTeam}
                  disabled={!newTeamName.trim()}
                  className="flex-1 py-3 bg-neon-green text-cyber-dark rounded-xl hover:bg-green-400 transition-colors disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Create Team
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
