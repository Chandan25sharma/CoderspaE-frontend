'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Trophy, Calendar, Users, Award, Clock, Star } from 'lucide-react';
import { AnimatedBadge } from '@/components/AnimatedBadge';

interface Tournament {
  id: string;
  name: string;
  description: string;
  sponsor: {
    name: string;
    logo: string;
  };
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxParticipants: number;
  currentParticipants: number;
  prizePool: number;
  format: 'single-elimination' | 'round-robin' | 'swiss';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  rules: string[];
  status: 'upcoming' | 'registration' | 'active' | 'completed';
  featured: boolean;
}

const mockTournaments: Tournament[] = [
  {
    id: '1',
    name: 'CodeClash World Championship 2025',
    description: 'The ultimate coding competition featuring the world\'s best developers competing for glory and prizes.',
    sponsor: {
      name: 'TechCorp',
      logo: '/sponsor-logos/techcorp.png'
    },
    startDate: '2025-08-15',
    endDate: '2025-08-17',
    registrationDeadline: '2025-08-10',
    maxParticipants: 256,
    currentParticipants: 187,
    prizePool: 100000,
    format: 'single-elimination',
    difficulty: 'expert',
    rules: [
      'No external resources allowed',
      'Time limit: 90 minutes per round',
      'Languages: JavaScript, Python, TypeScript, Java, C++',
      'AI assistance prohibited'
    ],
    status: 'registration',
    featured: true,
  },
  {
    id: '2',
    name: 'AI Challenge Cup',
    description: 'Machine learning and neural network focused tournament for AI enthusiasts.',
    sponsor: {
      name: 'DeepMind',
      logo: '/sponsor-logos/deepmind.png'
    },
    startDate: '2025-08-01',
    endDate: '2025-08-03',
    registrationDeadline: '2025-07-28',
    maxParticipants: 128,
    currentParticipants: 95,
    prizePool: 50000,
    format: 'round-robin',
    difficulty: 'advanced',
    rules: [
      'AI/ML focused challenges only',
      'TensorFlow and PyTorch allowed',
      'Time limit: 2 hours per challenge',
      'Team participation allowed (max 3 members)'
    ],
    status: 'registration',
    featured: true,
  },
  {
    id: '3',
    name: 'Speed Coding Sprint',
    description: 'Fast-paced tournament focusing on algorithm implementation speed.',
    sponsor: {
      name: 'FastCode Inc',
      logo: '/sponsor-logos/fastcode.png'
    },
    startDate: '2025-07-25',
    endDate: '2025-07-25',
    registrationDeadline: '2025-07-23',
    maxParticipants: 64,
    currentParticipants: 64,
    prizePool: 15000,
    format: 'swiss',
    difficulty: 'intermediate',
    rules: [
      'Each round: 30 minutes',
      'Basic algorithms only',
      'No IDE autocomplete',
      'Real-time scoring'
    ],
    status: 'completed',
    featured: false,
  },
];

export default function TournamentPage() {
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredTournaments = mockTournaments.filter(tournament => 
    filterStatus === 'all' || tournament.status === filterStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-neon-blue bg-neon-blue/20';
      case 'registration': return 'text-neon-green bg-neon-green/20';
      case 'active': return 'text-neon-yellow bg-neon-yellow/20';
      case 'completed': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-orange-400';
      case 'expert': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPrizePool = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleRegister = (tournament: Tournament) => {
    // TODO: Implement registration logic
    console.log('Registering for tournament:', tournament.id);
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
            <Trophy className="h-12 w-12 text-neon-yellow" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-neon-yellow via-neon-red to-neon-purple bg-clip-text text-transparent">
              Tournaments
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Compete in prestigious tournaments, win amazing prizes, and establish your dominance in the coding arena
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-cyber-gray rounded-xl p-1 flex gap-1">
            {['all', 'registration', 'upcoming', 'active', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  filterStatus === status
                    ? 'bg-neon-blue text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-cyber-light'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Featured Tournaments */}
        {filterStatus === 'all' && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
              <Star className="h-8 w-8 text-neon-yellow" />
              Featured Tournaments
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockTournaments.filter(t => t.featured).map((tournament, index) => (
                <motion.div
                  key={tournament.id}
                  className="bg-gradient-to-br from-cyber-gray to-cyber-light rounded-2xl p-8 border border-neon-yellow/30 relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Featured Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-neon-yellow text-cyber-dark px-3 py-1 rounded-full text-sm font-bold">
                      FEATURED
                    </div>
                  </div>

                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{tournament.name}</h3>
                      <p className="text-gray-300 max-w-md">{tournament.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neon-green">{formatPrizePool(tournament.prizePool)}</div>
                      <div className="text-xs text-gray-400">Prize Pool</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neon-blue">{tournament.currentParticipants}/{tournament.maxParticipants}</div>
                      <div className="text-xs text-gray-400">Participants</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-neon-yellow">{formatDate(tournament.startDate)}</div>
                      <div className="text-xs text-gray-400">Start Date</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${getDifficultyColor(tournament.difficulty)}`}>
                        {tournament.difficulty.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-400">Difficulty</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => setSelectedTournament(tournament)}
                      className="flex-1 py-3 bg-cyber-light text-white rounded-xl hover:bg-gray-600 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      View Details
                    </motion.button>
                    {tournament.status === 'registration' && (
                      <motion.button
                        onClick={() => handleRegister(tournament)}
                        className="flex-1 py-3 bg-neon-green text-cyber-dark font-bold rounded-xl hover:bg-green-400 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Register Now
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Tournaments */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament, index) => (
            <motion.div
              key={tournament.id}
              className="bg-cyber-gray rounded-2xl p-6 border border-gray-700 hover:border-neon-blue/50 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(tournament.status)}`}>
                  {tournament.status.toUpperCase()}
                </div>
                <AnimatedBadge
                  type={tournament.difficulty === 'expert' ? 'diamond' : tournament.difficulty === 'advanced' ? 'gold' : 'silver'}
                  category="challenges"
                  level={1}
                  size="sm"
                  showLevel={false}
                />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{tournament.name}</h3>
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">{tournament.description}</p>

              {/* Tournament Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Award className="h-4 w-4" />
                  <span>{formatPrizePool(tournament.prizePool)} prize pool</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="h-4 w-4" />
                  <span>{tournament.currentParticipants}/{tournament.maxParticipants} participants</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTournament(tournament)}
                  className="flex-1 py-2 bg-cyber-light text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                >
                  Details
                </button>
                {tournament.status === 'registration' && (
                  <button
                    onClick={() => handleRegister(tournament)}
                    className="flex-1 py-2 bg-neon-green text-cyber-dark font-semibold rounded-lg hover:bg-green-400 transition-colors text-sm"
                  >
                    Register
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tournament Detail Modal */}
        {selectedTournament && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-cyber-gray rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-white">{selectedTournament.name}</h2>
                  <button
                    onClick={() => setSelectedTournament(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div>
                    <p className="text-gray-300 mb-6">{selectedTournament.description}</p>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-neon-blue" />
                        <div>
                          <div className="text-white font-semibold">Tournament Dates</div>
                          <div className="text-gray-400 text-sm">
                            {formatDate(selectedTournament.startDate)} - {formatDate(selectedTournament.endDate)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-neon-yellow" />
                        <div>
                          <div className="text-white font-semibold">Registration Deadline</div>
                          <div className="text-gray-400 text-sm">{formatDate(selectedTournament.registrationDeadline)}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-neon-green" />
                        <div>
                          <div className="text-white font-semibold">Participants</div>
                          <div className="text-gray-400 text-sm">
                            {selectedTournament.currentParticipants} / {selectedTournament.maxParticipants} registered
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Award className="h-5 w-5 text-neon-purple" />
                        <div>
                          <div className="text-white font-semibold">Prize Pool</div>
                          <div className="text-neon-green text-lg font-bold">{formatPrizePool(selectedTournament.prizePool)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Tournament Rules</h3>
                    <ul className="space-y-2 mb-6">
                      {selectedTournament.rules.map((rule, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="text-neon-blue mt-1">•</div>
                          <span className="text-gray-300 text-sm">{rule}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="bg-cyber-light rounded-xl p-4 mb-6">
                      <h4 className="text-lg font-semibold text-white mb-2">Format</h4>
                      <p className="text-gray-300 text-sm capitalize">{selectedTournament.format.replace('-', ' ')}</p>
                    </div>

                    <div className="bg-cyber-light rounded-xl p-4">
                      <h4 className="text-lg font-semibold text-white mb-2">Difficulty Level</h4>
                      <p className={`text-sm font-semibold capitalize ${getDifficultyColor(selectedTournament.difficulty)}`}>
                        {selectedTournament.difficulty}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                {selectedTournament.status === 'registration' && (
                  <div className="mt-8 text-center">
                    <motion.button
                      onClick={() => handleRegister(selectedTournament)}
                      className="px-8 py-4 bg-neon-green text-cyber-dark font-bold text-lg rounded-xl hover:bg-green-400 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Register for Tournament
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
