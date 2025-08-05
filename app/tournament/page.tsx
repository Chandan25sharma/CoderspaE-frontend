'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Trophy, Calendar, Users, Star, Loader2 } from 'lucide-react';
// import { AnimatedBadge } from '../../components/AnimatedBadge';
import { tournamentApi } from '../lib/api';

interface Tournament {
  _id: string;
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
  participants: string[];
  isRegistrationOpen?: boolean;
  participationPercentage?: number;
}

const TournamentPage = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'featured' | 'active' | 'upcoming' | 'completed'>('featured');
  const [registering, setRegistering] = useState<string | null>(null);

  // Fetch tournaments from API
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        const response = await tournamentApi.getAll();
        setTournaments(response.tournaments || []);
      } catch (err) {
        console.error('Failed to fetch tournaments:', err);
        setError('Failed to load tournaments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const handleRegister = async (tournament: Tournament) => {
    try {
      setRegistering(tournament._id);
      await tournamentApi.register(tournament._id);
      
      // Update the tournament data
      setTournaments(prev => 
        prev.map(t => 
          t._id === tournament._id 
            ? { ...t, currentParticipants: t.currentParticipants + 1 }
            : t
        )
      );
      
      alert('Successfully registered for tournament!');
    } catch (err) {
      console.error('Registration failed:', err);
      alert('Failed to register for tournament. Please try again.');
    } finally {
      setRegistering(null);
    }
  };

  // Filter tournaments based on active tab
  const filteredTournaments = tournaments.filter(tournament => {
    switch (activeTab) {
      case 'featured':
        return tournament.featured;
      case 'active':
        return tournament.status === 'active';
      case 'upcoming':
        return tournament.status === 'upcoming' || tournament.status === 'registration';
      case 'completed':
        return tournament.status === 'completed';
      default:
        return true;
    }
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-400/10';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/10';
      case 'advanced': return 'text-orange-400 bg-orange-400/10';
      case 'expert': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registration': return 'text-blue-400 bg-blue-400/10';
      case 'active': return 'text-green-400 bg-green-400/10';
      case 'upcoming': return 'text-yellow-400 bg-yellow-400/10';
      case 'completed': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPrize = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
          <p className="text-gray-300 mt-4">Loading tournaments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <Trophy className="h-16 w-16 text-yellow-400 mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Featured Tournaments
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Compete against the world&apos;s best developers in high-stakes coding tournaments. 
            Win prizes, gain recognition, and prove your programming prowess.
          </p>
        </motion.div>

        {/* Featured Tournaments */}
        {tournaments.filter(t => t.featured).length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="flex items-center mb-8">
              <Star className="h-8 w-8 text-yellow-400 mr-3" />
              <h2 className="text-3xl font-bold text-white">Featured Tournaments</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {tournaments.filter(t => t.featured).map((tournament, index) => (
                <motion.div
                  key={tournament._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl" />
                  <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="mb-3 inline-block px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full border border-yellow-500/30">
                          FEATURED
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{tournament.name}</h3>
                        <p className="text-gray-300">{tournament.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-yellow-400">{formatPrize(tournament.prizePool)}</div>
                        <div className="text-sm text-gray-400">Prize Pool</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center text-gray-300">
                        <Users className="h-5 w-5 mr-2 text-blue-400" />
                        <span>{tournament.currentParticipants}/{tournament.maxParticipants}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Calendar className="h-5 w-5 mr-2 text-green-400" />
                        <span>{formatDate(tournament.startDate)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(tournament.difficulty)}`}>
                        {tournament.difficulty.toUpperCase()}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tournament.status)}`}>
                        {tournament.status.toUpperCase()}
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
                        View Details
                      </button>
                      <button 
                        onClick={() => handleRegister(tournament)}
                        disabled={registering === tournament._id || tournament.status !== 'registration'}
                        className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                          tournament.status === 'registration' 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {registering === tournament._id ? (
                          <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                        ) : tournament.status === 'registration' ? (
                          'Register Now'
                        ) : (
                          'Registration Closed'
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Tournament Categories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex space-x-1 mb-8 bg-gray-800/50 p-2 rounded-lg">
            {(['featured', 'upcoming', 'active', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament, index) => (
              <motion.div
                key={tournament._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">{tournament.name}</h3>
                  {tournament.featured && <Star className="h-5 w-5 text-yellow-400" />}
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{tournament.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Prize Pool</span>
                    <span className="text-yellow-400 font-bold">{formatPrize(tournament.prizePool)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Participants</span>
                    <span className="text-white">{tournament.currentParticipants}/{tournament.maxParticipants}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Start Date</span>
                    <span className="text-white">{formatDate(tournament.startDate)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(tournament.difficulty)}`}>
                    {tournament.difficulty.toUpperCase()}
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(tournament.status)}`}>
                    {tournament.status.toUpperCase()}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm transition-colors">
                    View Details
                  </button>
                  <button 
                    onClick={() => handleRegister(tournament)}
                    disabled={registering === tournament._id || tournament.status !== 'registration'}
                    className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                      tournament.status === 'registration' 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {registering === tournament._id ? (
                      <Loader2 className="h-3 w-3 animate-spin mx-auto" />
                    ) : tournament.status === 'registration' ? (
                      'Register'
                    ) : (
                      'Closed'
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredTournaments.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No tournaments found</h3>
              <p className="text-gray-500">No tournaments match the current filter. Try selecting a different category.</p>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default TournamentPage;
