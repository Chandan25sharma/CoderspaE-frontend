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
  Search
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'leader' | 'member';
  location: string;
  occupation: 'student' | 'working';
  institution: string;
  joinedAt: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  maxMembers: number;
  currentMembers: number;
  leader: TeamMember;
  members: TeamMember[];
  location: string;
  createdAt: string;
  isPrivate: boolean;
}

export default function TeamsPage() {
  const { data: session } = useSession();
  const [teams, setTeams] = useState<Team[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    maxMembers: 4,
    location: '',
    occupation: 'student' as 'student' | 'working',
    institution: '',
    isPrivate: false
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const mockTeams: Team[] = [
        {
          id: '1',
          name: 'Code Warriors',
          description: 'Competitive programming team focused on algorithms and data structures',
          maxMembers: 4,
          currentMembers: 3,
          leader: {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'leader',
            location: 'San Francisco, CA',
            occupation: 'working',
            institution: 'Google',
            joinedAt: '2024-01-15'
          },
          members: [],
          location: 'San Francisco, CA',
          createdAt: '2024-01-15',
          isPrivate: false
        }
      ];
      setTeams(mockTeams);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      alert('Please sign in to create a team');
      return;
    }

    try {
      const teamData = {
        ...createForm,
        leaderId: session.user?.email,
        leaderName: session.user?.name,
        leaderEmail: session.user?.email
      };

      console.log('Creating team:', teamData);
      
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        description: '',
        maxMembers: 4,
        location: '',
        occupation: 'student',
        institution: '',
        isPrivate: false
      });
      
      fetchTeams();
      alert('Team created successfully!');
    } catch (error) {
      console.error('Failed to create team:', error);
      alert('Failed to create team. Please try again.');
    }
  };

  const handleJoinTeam = async (teamId: string) => {
    if (!session) {
      alert('Please sign in to join a team');
      return;
    }

    try {
      console.log('Sending join request for team:', teamId);
      alert('Join request sent successfully!');
    } catch (error) {
      console.error('Failed to send join request:', error);
      alert('Failed to send join request. Please try again.');
    }
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Users className="h-16 w-16 text-blue-400 mx-auto mb-6" />
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center mb-6"
          >
            <Users className="h-16 w-16 text-blue-400 mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">
              Teams
            </h1>
          </motion.div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join forces with fellow coders, compete in team battles, and achieve greatness together.
          </p>
        </div>

        {/* Search and Create */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Team
          </button>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{team.name}</h3>
                <div className="flex items-center text-blue-400">
                  <Crown className="w-5 h-5 mr-1" />
                  <span className="text-sm">Leader</span>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">{team.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-400 text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{team.currentMembers}/{team.maxMembers} members</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{team.location}</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  {team.leader.occupation === 'working' ? (
                    <Briefcase className="w-4 h-4 mr-2" />
                  ) : (
                    <GraduationCap className="w-4 h-4 mr-2" />
                  )}
                  <span>{team.leader.institution}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Led by {team.leader.name}
                </div>
                <button
                  onClick={() => handleJoinTeam(team.id)}
                  disabled={team.currentMembers >= team.maxMembers}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    team.currentMembers >= team.maxMembers
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {team.currentMembers >= team.maxMembers ? 'Full' : 'Join Team'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create Team Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Create New Team</h2>
              
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Team Name</label>
                  <input
                    type="text"
                    required
                    value={createForm.name}
                    onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Enter team name"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Description</label>
                  <textarea
                    required
                    value={createForm.description}
                    onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none h-24 resize-none"
                    placeholder="Describe your team"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Max Team Members</label>
                  <select
                    value={createForm.maxMembers}
                    onChange={(e) => setCreateForm({...createForm, maxMembers: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  >
                    {[2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} members</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    required
                    value={createForm.location}
                    onChange={(e) => setCreateForm({...createForm, location: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Occupation</label>
                  <select
                    value={createForm.occupation}
                    onChange={(e) => setCreateForm({...createForm, occupation: e.target.value as 'student' | 'working'})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="student">Student</option>
                    <option value="working">Working Professional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    {createForm.occupation === 'student' ? 'School/University' : 'Company'}
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.institution}
                    onChange={(e) => setCreateForm({...createForm, institution: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                    placeholder={createForm.occupation === 'student' ? 'Enter school name' : 'Enter company name'}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    checked={createForm.isPrivate}
                    onChange={(e) => setCreateForm({...createForm, isPrivate: e.target.checked})}
                    className="mr-3 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isPrivate" className="text-gray-300">
                    Private Team (invite only)
                  </label>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                  >
                    Create Team
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
