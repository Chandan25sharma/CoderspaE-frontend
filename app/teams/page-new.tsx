'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  Users, 
  Plus, 
  Crown, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Search,
  Trophy,
  Target,
  Shield,
  Swords,
  Calendar,
  Clock,
  Star,
  UserPlus,
  Send
} from 'lucide-react';

interface Team {
  id: string;
  name: string;
  description: string;
  maxMembers: number;
  currentMembers: number;
  leader: {
    id: string;
    name: string;
    avatar?: string;
  };
  members: TeamMember[];
  stats: {
    battlesPlayed: number;
    battlesWon: number;
    winRate: number;
    totalPoints: number;
    averageRating: number;
    rank: number;
  };
  tags: string[];
  isPublic: boolean;
  avatar?: string;
  createdAt: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'leader' | 'member';
  avatar?: string;
  rating: number;
  joinedAt: string;
  stats: {
    contributions: number;
    battlesParticipated: number;
  };
}

interface TeamChallenge {
  challengerTeamId: string;
  challengedTeamId: string;
  battleMode: string;
  problems: Array<{
    id: string;
    title: string;
    difficulty: string;
    timeLimit: number;
  }>;
  scheduledDateTime: string;
  message: string;
}

const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Code Warriors',
    description: 'Elite team of competitive programmers specializing in algorithms and data structures',
    maxMembers: 8,
    currentMembers: 6,
    leader: { id: '1', name: 'Alice Johnson', avatar: '/avatars/alice.png' },
    members: [],
    stats: {
      battlesPlayed: 45,
      battlesWon: 32,
      winRate: 71.1,
      totalPoints: 2850,
      averageRating: 1650,
      rank: 1
    },
    tags: ['Competitive', 'Algorithms', 'Advanced'],
    isPublic: true,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Debug Dynasty',
    description: 'Masters of debugging and problem-solving with a focus on clean code practices',
    maxMembers: 6,
    currentMembers: 5,
    leader: { id: '2', name: 'Bob Smith', avatar: '/avatars/bob.png' },
    members: [],
    stats: {
      battlesPlayed: 38,
      battlesWon: 24,
      winRate: 63.2,
      totalPoints: 2340,
      averageRating: 1520,
      rank: 2
    },
    tags: ['Problem Solving', 'Clean Code', 'Debugging'],
    isPublic: true,
    createdAt: '2024-02-20'
  },
  {
    id: '3',
    name: 'Binary Beasts',
    description: 'Focused on low-level programming and system optimization challenges',
    maxMembers: 10,
    currentMembers: 8,
    leader: { id: '3', name: 'Carol Davis', avatar: '/avatars/carol.png' },
    members: [],
    stats: {
      battlesPlayed: 42,
      battlesWon: 25,
      winRate: 59.5,
      totalPoints: 2180,
      averageRating: 1480,
      rank: 3
    },
    tags: ['System Programming', 'Optimization', 'C++'],
    isPublic: true,
    createdAt: '2024-03-10'
  }
];

const battleModes = [
  { id: 'quick-battle', name: 'Quick Battle', description: 'Fast-paced 30-minute team battles' },
  { id: 'minimalist-mind', name: 'Minimalist Mind', description: 'Code golf and optimization challenges' },
  { id: 'mirror-arena', name: 'Mirror Arena', description: 'Same problem, different approaches' },
  { id: 'team-clash', name: 'Team Clash', description: 'Full team collaboration battles' }
];

const mockProblems = [
  { id: '1', title: 'Two Sum Array', difficulty: 'Easy', timeLimit: 15 },
  { id: '2', title: 'Binary Tree Traversal', difficulty: 'Medium', timeLimit: 30 },
  { id: '3', title: 'Dynamic Programming Matrix', difficulty: 'Hard', timeLimit: 45 },
  { id: '4', title: 'Graph Shortest Path', difficulty: 'Medium', timeLimit: 25 },
  { id: '5', title: 'String Pattern Matching', difficulty: 'Easy', timeLimit: 20 }
];

export default function TeamsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'my-teams'>('leaderboard');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [challengeForm, setChallengeForm] = useState<TeamChallenge>({
    challengerTeamId: '',
    challengedTeamId: '',
    battleMode: '',
    problems: [],
    scheduledDateTime: '',
    message: ''
  });

  const filteredTeams = mockTeams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleChallengeTeam = (team: Team) => {
    setChallengeForm({
      ...challengeForm,
      challengedTeamId: team.id
    });
    setShowChallengeModal(true);
  };

  const handleSendChallenge = () => {
    // TODO: Implement challenge sending logic
    console.log('Sending team challenge:', challengeForm);
    setShowChallengeModal(false);
    // Reset form
    setChallengeForm({
      challengerTeamId: '',
      challengedTeamId: '',
      battleMode: '',
      problems: [],
      scheduledDateTime: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-950 to-black">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Teams</h1>
          </div>
          <p className="text-gray-400">Join teams, compete together, and climb the leaderboards</p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          className="flex space-x-1 bg-gray-800/30 backdrop-blur-lg rounded-2xl p-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Trophy className="w-5 h-5" />
            Team Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('my-teams')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all ${
              activeTab === 'my-teams'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Users className="w-5 h-5" />
            Your Teams
          </button>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'leaderboard' ? (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search teams..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Teams Leaderboard */}
              <div className="space-y-4">
                {filteredTeams.map((team, index) => (
                  <motion.div
                    key={team.id}
                    className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedTeam(team)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Rank */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                          team.stats.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                          team.stats.rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                          team.stats.rank === 3 ? 'bg-amber-600/20 text-amber-400' :
                          'bg-gray-600/20 text-gray-400'
                        }`}>
                          {team.stats.rank === 1 && <Crown className="w-6 h-6" />}
                          {team.stats.rank !== 1 && `#${team.stats.rank}`}
                        </div>

                        {/* Team Info */}
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{team.name}</h3>
                          <p className="text-gray-400 text-sm mb-2">{team.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-blue-400">
                              <Users className="w-4 h-4 inline mr-1" />
                              {team.currentMembers}/{team.maxMembers}
                            </span>
                            <span className="text-green-400">
                              {team.stats.winRate.toFixed(1)}% Win Rate
                            </span>
                            <span className="text-purple-400">
                              {team.stats.totalPoints} Points
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{team.stats.totalPoints}</div>
                        <div className="text-gray-400 text-sm">Total Points</div>
                        <div className="flex gap-2 mt-2">
                          {team.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-lg">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="my-teams"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12"
            >
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Teams Yet</h3>
              <p className="text-gray-500 mb-6">Join or create a team to start competing together</p>
              <Link
                href="/teams/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Team
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Team Details Modal */}
        <AnimatePresence>
          {selectedTeam && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTeam(null)}
            >
              <motion.div
                className="bg-gray-800 rounded-2xl border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  {/* Team Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-2xl ${
                        selectedTeam.stats.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                        selectedTeam.stats.rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                        selectedTeam.stats.rank === 3 ? 'bg-amber-600/20 text-amber-400' :
                        'bg-gray-600/20 text-gray-400'
                      }`}>
                        {selectedTeam.stats.rank === 1 ? <Crown className="w-8 h-8" /> : `#${selectedTeam.stats.rank}`}
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white">{selectedTeam.name}</h2>
                        <p className="text-gray-400">{selectedTeam.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTeam(null)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Team Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-700/50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400">{selectedTeam.stats.battlesPlayed}</div>
                      <div className="text-gray-400 text-sm">Battles Played</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">{selectedTeam.stats.battlesWon}</div>
                      <div className="text-gray-400 text-sm">Battles Won</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-purple-400">{selectedTeam.stats.winRate.toFixed(1)}%</div>
                      <div className="text-gray-400 text-sm">Win Rate</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-400">{selectedTeam.stats.averageRating}</div>
                      <div className="text-gray-400 text-sm">Avg Rating</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 justify-center">
                    {selectedTeam.currentMembers < selectedTeam.maxMembers && (
                      <motion.button
                        className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <UserPlus className="w-5 h-5" />
                        Join Team
                      </motion.button>
                    )}
                    <motion.button
                      onClick={() => handleChallengeTeam(selectedTeam)}
                      className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Swords className="w-5 h-5" />
                      Challenge Team
                    </motion.button>
                  </div>

                  {/* Team Tags */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Team Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTeam.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Challenge Modal */}
        <AnimatePresence>
          {showChallengeModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowChallengeModal(false)}
            >
              <motion.div
                className="bg-gray-800 rounded-2xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">Challenge Team</h3>
                    <button
                      onClick={() => setShowChallengeModal(false)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Battle Mode Selection */}
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-3">Battle Mode</label>
                      <div className="grid grid-cols-2 gap-3">
                        {battleModes.map((mode) => (
                          <div
                            key={mode.id}
                            onClick={() => setChallengeForm({ ...challengeForm, battleMode: mode.id })}
                            className={`p-4 rounded-xl cursor-pointer transition-all border ${
                              challengeForm.battleMode === mode.id
                                ? 'border-blue-500 bg-blue-500/20'
                                : 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                            }`}
                          >
                            <h4 className="font-semibold text-white">{mode.name}</h4>
                            <p className="text-gray-400 text-sm mt-1">{mode.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Problem Selection */}
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-3">
                        Select Problems ({challengeForm.problems.length} selected)
                      </label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {mockProblems.map((problem) => (
                          <div
                            key={problem.id}
                            onClick={() => {
                              const isSelected = challengeForm.problems.some(p => p.id === problem.id);
                              if (isSelected) {
                                setChallengeForm({
                                  ...challengeForm,
                                  problems: challengeForm.problems.filter(p => p.id !== problem.id)
                                });
                              } else {
                                setChallengeForm({
                                  ...challengeForm,
                                  problems: [...challengeForm.problems, problem]
                                });
                              }
                            }}
                            className={`p-3 rounded-lg cursor-pointer transition-all border ${
                              challengeForm.problems.some(p => p.id === problem.id)
                                ? 'border-green-500 bg-green-500/20'
                                : 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-white">{problem.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                    problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-red-500/20 text-red-400'
                                  }`}>
                                    {problem.difficulty}
                                  </span>
                                  <span className="text-gray-400 text-xs">
                                    <Clock className="w-3 h-3 inline mr-1" />
                                    {problem.timeLimit}m
                                  </span>
                                </div>
                              </div>
                              {challengeForm.problems.some(p => p.id === problem.id) && (
                                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Schedule DateTime */}
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Schedule Date & Time</label>
                      <input
                        type="datetime-local"
                        value={challengeForm.scheduledDateTime}
                        onChange={(e) => setChallengeForm({ ...challengeForm, scheduledDateTime: e.target.value })}
                        min={new Date().toISOString().slice(0, 16)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Challenge Message</label>
                      <textarea
                        value={challengeForm.message}
                        onChange={(e) => setChallengeForm({ ...challengeForm, message: e.target.value })}
                        placeholder="Add a message to your challenge..."
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>

                    {/* Send Challenge Button */}
                    <motion.button
                      onClick={handleSendChallenge}
                      disabled={!challengeForm.battleMode || challengeForm.problems.length === 0 || !challengeForm.scheduledDateTime}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Send className="w-5 h-5" />
                      Send Challenge
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
