'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Swords,
  Search,
  Filter,
  Play,
  Pause,
  Eye,
  Flag,
  Clock,
  Users,
  Trophy,
  CheckCircle,
  XCircle,
  Calendar,
  Timer,
  Code
} from 'lucide-react';

interface Battle {
  _id: string;
  title: string;
  type: 'quick' | 'tournament' | 'practice' | 'ranked';
  status: 'waiting' | 'active' | 'completed' | 'cancelled';
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
  participants: {
    _id: string;
    name: string;
    avatar?: string;
  }[];
  maxParticipants: number;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  prize?: number;
  creator: {
    _id: string;
    name: string;
  };
  problem: {
    title: string;
    difficulty: string;
  };
  reports: number;
  spectators: number;
}

const BattleManagement = () => {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedBattle, setSelectedBattle] = useState<Battle | null>(null);
  const [showBattleModal, setShowBattleModal] = useState(false);

  // Mock data - in production, fetch from API
  useEffect(() => {
    const mockBattles: Battle[] = [
      {
        _id: '1',
        title: 'Algorithm Sprint Challenge',
        type: 'ranked',
        status: 'active',
        difficulty: 'medium',
        language: 'JavaScript',
        participants: [
          { _id: '1', name: 'John Doe' },
          { _id: '2', name: 'Sarah Wilson' }
        ],
        maxParticipants: 2,
        startTime: '2024-01-20T10:00:00Z',
        duration: 60,
        creator: { _id: '3', name: 'Admin' },
        problem: {
          title: 'Binary Tree Maximum Path Sum',
          difficulty: 'medium'
        },
        reports: 0,
        spectators: 15
      },
      {
        _id: '2',
        title: 'Weekly Tournament Final',
        type: 'tournament',
        status: 'waiting',
        difficulty: 'hard',
        language: 'Python',
        participants: [
          { _id: '4', name: 'Mike Chen' },
          { _id: '5', name: 'Emily Davis' },
          { _id: '6', name: 'Alex Johnson' }
        ],
        maxParticipants: 8,
        startTime: '2024-01-20T15:00:00Z',
        duration: 120,
        prize: 500,
        creator: { _id: '7', name: 'Tournament System' },
        problem: {
          title: 'Graph Algorithms Challenge',
          difficulty: 'hard'
        },
        reports: 0,
        spectators: 42
      },
      {
        _id: '3',
        title: 'Quick Practice Round',
        type: 'practice',
        status: 'completed',
        difficulty: 'easy',
        language: 'Java',
        participants: [
          { _id: '8', name: 'Lisa Park' }
        ],
        maxParticipants: 1,
        startTime: '2024-01-19T14:30:00Z',
        endTime: '2024-01-19T15:00:00Z',
        duration: 30,
        creator: { _id: '8', name: 'Lisa Park' },
        problem: {
          title: 'Array Manipulation Basics',
          difficulty: 'easy'
        },
        reports: 0,
        spectators: 3
      },
      {
        _id: '4',
        title: 'Reported Battle - Suspicious Activity',
        type: 'quick',
        status: 'cancelled',
        difficulty: 'medium',
        language: 'C++',
        participants: [
          { _id: '9', name: 'User1' },
          { _id: '10', name: 'User2' }
        ],
        maxParticipants: 2,
        startTime: '2024-01-19T16:00:00Z',
        endTime: '2024-01-19T16:45:00Z',
        duration: 45,
        creator: { _id: '9', name: 'User1' },
        problem: {
          title: 'Dynamic Programming Challenge',
          difficulty: 'medium'
        },
        reports: 3,
        spectators: 8
      }
    ];

    setTimeout(() => {
      setBattles(mockBattles);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredBattles = battles.filter(battle => {
    const matchesSearch = battle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         battle.problem.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || battle.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || battle.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleBattleAction = (action: string, battleId: string) => {
    setBattles(prevBattles => 
      prevBattles.map(battle => {
        if (battle._id === battleId) {
          switch (action) {
            case 'cancel':
              return { ...battle, status: 'cancelled' as const };
            case 'pause':
              return { ...battle, status: 'waiting' as const };
            case 'resume':
              return { ...battle, status: 'active' as const };
            default:
              return battle;
          }
        }
        return battle;
      })
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: Battle['status']) => {
    switch (status) {
      case 'active':
        return <Play className="h-4 w-4 text-green-400" />;
      case 'waiting':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-400" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Battle['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-400/10';
      case 'waiting':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'completed':
        return 'text-blue-400 bg-blue-400/10';
      case 'cancelled':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'hard':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <AdminLayout activeSection="battles">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Battle Management</h1>
            <p className="text-gray-400 mt-1">Monitor and manage coding battles</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Create Battle
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
              Export Data
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search battles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="quick">Quick Battle</option>
              <option value="ranked">Ranked</option>
              <option value="tournament">Tournament</option>
              <option value="practice">Practice</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="waiting">Waiting</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Advanced Filters */}
            <button className="flex items-center justify-center px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors">
              <Filter className="h-5 w-5 mr-2" />
              More Filters
            </button>
          </div>
        </div>

        {/* Battle Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Battles</p>
                <p className="text-2xl font-bold text-white">{battles.length}</p>
              </div>
              <Swords className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Now</p>
                <p className="text-2xl font-bold text-green-400">
                  {battles.filter(b => b.status === 'active').length}
                </p>
              </div>
              <Play className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Waiting</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {battles.filter(b => b.status === 'waiting').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Reported</p>
                <p className="text-2xl font-bold text-red-400">
                  {battles.filter(b => b.reports > 0).length}
                </p>
              </div>
              <Flag className="h-8 w-8 text-red-400" />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Spectators</p>
                <p className="text-2xl font-bold text-purple-400">
                  {battles.reduce((sum, b) => sum + b.spectators, 0)}
                </p>
              </div>
              <Eye className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Battles Table */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Battle
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Type & Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Problem
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                      Loading battles...
                    </td>
                  </tr>
                ) : filteredBattles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                      No battles found
                    </td>
                  </tr>
                ) : (
                  filteredBattles.map((battle) => (
                    <motion.tr
                      key={battle._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">{battle.title}</div>
                          <div className="text-gray-400 text-sm">{battle.language}</div>
                          {battle.reports > 0 && (
                            <div className="flex items-center text-red-400 text-xs mt-1">
                              <Flag className="h-3 w-3 mr-1" />
                              {battle.reports} report{battle.reports > 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs font-medium capitalize">
                              {battle.type}
                            </span>
                          </div>
                          <div className="flex items-center">
                            {getStatusIcon(battle.status)}
                            <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(battle.status)}`}>
                              {battle.status}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-white">
                            {battle.participants.length}/{battle.maxParticipants} players
                          </div>
                          <div className="text-gray-400 text-xs">
                            {battle.spectators} spectators
                          </div>
                          {battle.prize && (
                            <div className="text-yellow-400 text-xs flex items-center mt-1">
                              <Trophy className="h-3 w-3 mr-1" />
                              ${battle.prize}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-white">{battle.problem.title}</div>
                          <div className={`text-xs ${getDifficultyColor(battle.difficulty)}`}>
                            {battle.difficulty}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-white">{formatDate(battle.startTime)}</div>
                          <div className="text-gray-400 text-xs flex items-center">
                            <Timer className="h-3 w-3 mr-1" />
                            {battle.duration}m
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedBattle(battle);
                              setShowBattleModal(true);
                            }}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {battle.status === 'active' && (
                            <button
                              onClick={() => handleBattleAction('pause', battle._id)}
                              className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                              title="Pause Battle"
                            >
                              <Pause className="h-4 w-4" />
                            </button>
                          )}
                          {battle.status === 'waiting' && (
                            <button
                              onClick={() => handleBattleAction('resume', battle._id)}
                              className="p-1 text-gray-400 hover:text-green-400 transition-colors"
                              title="Start Battle"
                            >
                              <Play className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleBattleAction('cancel', battle._id)}
                            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                            title="Cancel Battle"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-gray-400 text-sm">
            Showing {filteredBattles.length} of {battles.length} battles
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-gray-700 text-white rounded border border-gray-600 hover:bg-gray-600 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded">
              1
            </button>
            <button className="px-3 py-1 bg-gray-700 text-white rounded border border-gray-600 hover:bg-gray-600 transition-colors">
              2
            </button>
            <button className="px-3 py-1 bg-gray-700 text-white rounded border border-gray-600 hover:bg-gray-600 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Battle Detail Modal */}
      {showBattleModal && selectedBattle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Battle Details</h2>
              <button
                onClick={() => setShowBattleModal(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Battle Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">{selectedBattle.title}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Code className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-300">Language: {selectedBattle.language}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-300">Started: {formatDate(selectedBattle.startTime)}</span>
                    </div>
                    <div className="flex items-center">
                      <Timer className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-300">Duration: {selectedBattle.duration} minutes</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-300">
                        {selectedBattle.participants.length}/{selectedBattle.maxParticipants} participants
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-3">Status & Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      {getStatusIcon(selectedBattle.status)}
                      <span className={`ml-2 px-3 py-1 rounded-full text-sm ${getStatusColor(selectedBattle.status)}`}>
                        {selectedBattle.status}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-300">{selectedBattle.spectators} spectators</span>
                    </div>
                    {selectedBattle.reports > 0 && (
                      <div className="flex items-center">
                        <Flag className="h-4 w-4 text-red-400 mr-2" />
                        <span className="text-red-400">{selectedBattle.reports} reports</span>
                      </div>
                    )}
                    {selectedBattle.prize && (
                      <div className="flex items-center">
                        <Trophy className="h-4 w-4 text-yellow-400 mr-2" />
                        <span className="text-yellow-400">${selectedBattle.prize} prize</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Problem Info */}
              <div>
                <h4 className="text-white font-medium mb-3">Problem</h4>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-white">{selectedBattle.problem.title}</h5>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(selectedBattle.difficulty)}`}>
                      {selectedBattle.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Participants */}
              <div>
                <h4 className="text-white font-medium mb-3">Participants</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedBattle.participants.map((participant, index) => (
                    <div key={participant._id} className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-medium">
                            {participant.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-medium">{participant.name}</div>
                          <div className="text-gray-400 text-sm">Participant {index + 1}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-700">
                {selectedBattle.status === 'active' && (
                  <button
                    onClick={() => {
                      handleBattleAction('pause', selectedBattle._id);
                      setShowBattleModal(false);
                    }}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                  >
                    Pause Battle
                  </button>
                )}
                {selectedBattle.status === 'waiting' && (
                  <button
                    onClick={() => {
                      handleBattleAction('resume', selectedBattle._id);
                      setShowBattleModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Start Battle
                  </button>
                )}
                <button
                  onClick={() => {
                    handleBattleAction('cancel', selectedBattle._id);
                    setShowBattleModal(false);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Cancel Battle
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  View Live
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
};

export default BattleManagement;
