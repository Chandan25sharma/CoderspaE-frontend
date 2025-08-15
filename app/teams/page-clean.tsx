'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  Users, 
  Crown, 
  Search,
  Trophy,
  Target,
  Shield,
  Swords,
  Calendar,
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
    name: 'Binary Beasts',
    description: 'Passionate developers focused on web technologies and modern frameworks',
    maxMembers: 6,
    currentMembers: 4,
    leader: { id: '2', name: 'Bob Smith', avatar: '/avatars/bob.png' },
    members: [],
    stats: {
      battlesPlayed: 28,
      battlesWon: 19,
      winRate: 67.9,
      totalPoints: 1980,
      averageRating: 1520,
      rank: 2
    },
    tags: ['Web Dev', 'React', 'Modern'],
    isPublic: true,
    createdAt: '2024-02-20'
  },
  {
    id: '3',
    name: 'Syntax Squad',
    description: 'Learning-focused team for beginners and intermediate programmers',
    maxMembers: 10,
    currentMembers: 8,
    leader: { id: '3', name: 'Carol Davis', avatar: '/avatars/carol.png' },
    members: [],
    stats: {
      battlesPlayed: 15,
      battlesWon: 8,
      winRate: 53.3,
      totalPoints: 1200,
      averageRating: 1200,
      rank: 3
    },
    tags: ['Learning', 'Beginner-Friendly', 'Growth'],
    isPublic: true,
    createdAt: '2024-03-10'
  }
];

const battleModes = [
  {
    id: 'team_clash',
    name: 'Team Clash',
    description: 'Direct head-to-head competition between teams',
    icon: <Swords className="w-6 h-6" />,
    color: 'bg-red-500',
    maxTeams: 2,
    timeLimit: '60 minutes'
  },
  {
    id: 'attack_defend',
    name: 'Attack & Defend',
    description: 'Teams alternate between attacking and defending positions',
    icon: <Shield className="w-6 h-6" />,
    color: 'bg-blue-500',
    maxTeams: 2,
    timeLimit: '90 minutes'
  },
  {
    id: 'narrative_mode',
    name: 'Narrative Mode',
    description: 'Story-driven collaborative problem solving',
    icon: <Target className="w-6 h-6" />,
    color: 'bg-purple-500',
    maxTeams: 4,
    timeLimit: '120 minutes'
  }
];

const mockProblems = [
  { id: 'p1', title: 'Two Sum Algorithm', difficulty: 'Easy', timeLimit: 15 },
  { id: 'p2', title: 'Binary Tree Traversal', difficulty: 'Medium', timeLimit: 30 },
  { id: 'p3', title: 'Dynamic Programming Challenge', difficulty: 'Hard', timeLimit: 45 },
  { id: 'p4', title: 'Graph Theory Problem', difficulty: 'Hard', timeLimit: 60 },
  { id: 'p5', title: 'String Manipulation', difficulty: 'Medium', timeLimit: 25 }
];

export default function TeamsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'myTeams'>('leaderboard');
  const [teams] = useState<Team[]>(mockTeams);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengeForm, setChallengeForm] = useState<TeamChallenge>({
    challengerTeamId: '',
    challengedTeamId: '',
    battleMode: '',
    problems: [],
    scheduledDateTime: '',
    message: ''
  });

  // Filter teams based on search term
  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort teams by rank
  const sortedTeams = [...filteredTeams].sort((a, b) => a.stats.rank - b.stats.rank);

  const handleTeamClick = (team: Team) => {
    setSelectedTeam(team);
  };

  const handleChallengeTeam = (team: Team) => {
    setChallengeForm(prev => ({ 
      ...prev, 
      challengedTeamId: team.id,
      challengerTeamId: 'my-team-id' // This would come from user's current team
    }));
    setShowChallengeModal(true);
  };

  const handleSendChallenge = () => {
    // Implement challenge sending logic
    console.log('Sending challenge:', challengeForm);
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

  const toggleProblem = (problem: typeof mockProblems[0]) => {
    setChallengeForm(prev => ({
      ...prev,
      problems: prev.problems.find(p => p.id === problem.id)
        ? prev.problems.filter(p => p.id !== problem.id)
        : [...prev.problems, problem]
    }));
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Users className="h-16 w-16 text-blue-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Join Teams</h1>
          <p className="text-gray-300 mb-8">
            Sign in to create teams, join battles, and collaborate with fellow coders worldwide.
          </p>
          <div className="space-y-4">
            <Link href="/auth/signin" className="block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Sign In
            </Link>
            <Link href="/auth/signup" className="block w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center mb-6"
          >
            <Trophy className="h-16 w-16 text-blue-500 mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
              Teams Arena
            </h1>
          </motion.div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join forces with fellow coders, compete in team battles, and achieve greatness together.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-1 border border-gray-700/50">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Team Leaderboard
            </button>
            <button
              onClick={() => setActiveTab('myTeams')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'myTeams'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Your Teams
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTeams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
              onClick={() => handleTeamClick(team)}
            >
              {/* Rank Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  team.stats.rank === 1 ? 'bg-yellow-500 text-black' :
                  team.stats.rank === 2 ? 'bg-gray-400 text-white' :
                  team.stats.rank === 3 ? 'bg-orange-500 text-white' :
                  'bg-gray-600 text-white'
                }`}>
                  #{team.stats.rank}
                </div>
                <div className="flex items-center text-blue-400">
                  <Crown className="w-4 h-4 mr-1" />
                  <span className="text-xs">Leader</span>
                </div>
              </div>

              {/* Team Info */}
              <h3 className="text-xl font-bold text-white mb-2">{team.name}</h3>
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">{team.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{team.stats.battlesWon}</div>
                  <div className="text-xs text-gray-400">Wins</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">{team.stats.winRate}%</div>
                  <div className="text-xs text-gray-400">Win Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">{team.stats.totalPoints}</div>
                  <div className="text-xs text-gray-400">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-400">{team.stats.averageRating}</div>
                  <div className="text-xs text-gray-400">Rating</div>
                </div>
              </div>

              {/* Members */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-400 text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{team.currentMembers}/{team.maxMembers} members</span>
                </div>
                <div className="flex items-center">
                  {team.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full mr-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleChallengeTeam(team);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Swords className="w-4 h-4" />
                Challenge Team
              </button>
            </motion.div>
          ))}
        </div>

        {/* Team Details Modal */}
        <AnimatePresence>
          {selectedTeam && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedTeam(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedTeam.name}</h2>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedTeam.stats.rank === 1 ? 'bg-yellow-500 text-black' :
                        selectedTeam.stats.rank === 2 ? 'bg-gray-400 text-white' :
                        selectedTeam.stats.rank === 3 ? 'bg-orange-500 text-white' :
                        'bg-gray-600 text-white'
                      }`}>
                        Rank #{selectedTeam.stats.rank}
                      </span>
                      <span className="text-gray-400">Led by {selectedTeam.leader.name}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTeam(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-gray-300 mb-6">{selectedTeam.description}</p>

                {/* Detailed Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-white">{selectedTeam.stats.battlesPlayed}</div>
                    <div className="text-sm text-gray-400">Battles Played</div>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-400">{selectedTeam.stats.battlesWon}</div>
                    <div className="text-sm text-gray-400">Battles Won</div>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-400">{selectedTeam.stats.winRate}%</div>
                    <div className="text-sm text-gray-400">Win Rate</div>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-400">{selectedTeam.stats.averageRating}</div>
                    <div className="text-sm text-gray-400">Avg Rating</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTeam.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setSelectedTeam(null);
                      handleChallengeTeam(selectedTeam);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
                  >
                    <Swords className="w-5 h-5" />
                    Challenge Team
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                  >
                    <UserPlus className="w-5 h-5" />
                    Request to Join
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Challenge Modal */}
        <AnimatePresence>
          {showChallengeModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowChallengeModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-3xl font-bold text-white mb-6">Challenge Team</h2>

                {/* Battle Mode Selection */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Select Battle Mode</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {battleModes.map((mode) => (
                      <motion.button
                        key={mode.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setChallengeForm(prev => ({ ...prev, battleMode: mode.id }))}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          challengeForm.battleMode === mode.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-lg ${mode.color} flex items-center justify-center text-white mx-auto mb-3`}>
                          {mode.icon}
                        </div>
                        <h4 className="font-semibold text-white mb-2">{mode.name}</h4>
                        <p className="text-sm text-gray-400 mb-2">{mode.description}</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Max {mode.maxTeams} teams</span>
                          <span>{mode.timeLimit}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Problem Selection */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Select Problems ({challengeForm.problems.length} selected)
                  </h3>
                  <div className="space-y-2">
                    {mockProblems.map((problem) => (
                      <motion.label
                        key={problem.id}
                        whileHover={{ scale: 1.01 }}
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                          challengeForm.problems.find(p => p.id === problem.id)
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={!!challengeForm.problems.find(p => p.id === problem.id)}
                          onChange={() => toggleProblem(problem)}
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-white">{problem.title}</h4>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-medium ${
                                problem.difficulty === 'Easy' ? 'text-green-400' :
                                problem.difficulty === 'Medium' ? 'text-yellow-400' :
                                'text-red-400'
                              }`}>
                                {problem.difficulty}
                              </span>
                              <span className="text-sm text-gray-400">{problem.timeLimit}min</span>
                            </div>
                          </div>
                        </div>
                      </motion.label>
                    ))}
                  </div>
                </div>

                {/* Schedule & Message */}
                <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Schedule Battle
                    </label>
                    <input
                      type="datetime-local"
                      value={challengeForm.scheduledDateTime}
                      onChange={(e) => setChallengeForm(prev => ({ ...prev, scheduledDateTime: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Challenge Message
                    </label>
                    <textarea
                      value={challengeForm.message}
                      onChange={(e) => setChallengeForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Add a message to your challenge..."
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowChallengeModal(false)}
                    className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={handleSendChallenge}
                    disabled={!challengeForm.battleMode || challengeForm.problems.length === 0 || !challengeForm.scheduledDateTime}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send className="w-5 h-5" />
                    Send Challenge
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
