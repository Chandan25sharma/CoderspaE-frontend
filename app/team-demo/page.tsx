'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, Calendar, MessageSquare, Settings, Crown, Star, Award } from 'lucide-react';
import TeamChallengeNotifications from '@/components/TeamChallengeNotifications';
import { useTeamChallengeSocket } from '@/hooks/useTeamChallengeSocket';

export default function TeamChallengeDemo() {
  const {
    isConnected,
    sendTeamChallenge,
    joinTeamRoom,
    notifications
  } = useTeamChallengeSocket();

  const [selectedBattleMode, setSelectedBattleMode] = useState('Team Clash');
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [challengeMessage, setChallengeMessage] = useState('');

  const battleModes = [
    {
      name: 'Team Clash',
      description: 'Direct competition between teams',
      icon: <Trophy className="w-5 h-5" />,
      color: 'bg-red-500'
    },
    {
      name: 'Attack & Defend',
      description: 'Teams alternate between attacking and defending',
      icon: <Crown className="w-5 h-5" />,
      color: 'bg-blue-500'
    },
    {
      name: 'Narrative Mode',
      description: 'Story-driven collaborative problem solving',
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'bg-purple-500'
    }
  ];

  const mockProblems = [
    { id: 'p1', name: 'Two Sum', difficulty: 'Easy', points: 100 },
    { id: 'p2', name: 'Binary Tree Traversal', difficulty: 'Medium', points: 200 },
    { id: 'p3', name: 'Dynamic Programming Challenge', difficulty: 'Hard', points: 300 },
    { id: 'p4', name: 'Graph Algorithms', difficulty: 'Hard', points: 350 },
    { id: 'p5', name: 'String Manipulation', difficulty: 'Easy', points: 150 }
  ];

  const mockTeams = [
    {
      id: 'team1',
      name: 'Code Warriors',
      members: 5,
      rating: 1850,
      rank: 2,
      isMyTeam: true
    },
    {
      id: 'team2',
      name: 'Syntax Errors',
      members: 4,
      rating: 1720,
      rank: 5,
      isMyTeam: false
    },
    {
      id: 'team3',
      name: 'Binary Beasts',
      members: 6,
      rating: 1950,
      rank: 1,
      isMyTeam: false
    }
  ];

  const handleSendChallenge = (targetTeamId: string) => {
    if (!selectedProblems.length || !scheduledDate) {
      alert('Please select problems and schedule date');
      return;
    }

    const myTeam = mockTeams.find(t => t.isMyTeam);
    const targetTeam = mockTeams.find(t => t.id === targetTeamId);

    if (!myTeam || !targetTeam) return;

    const challengeData = {
      challengeId: `challenge-${Date.now()}`,
      fromTeam: {
        id: myTeam.id,
        name: myTeam.name
      },
      toTeam: {
        id: targetTeam.id,
        name: targetTeam.name
      },
      battleMode: selectedBattleMode,
      problems: selectedProblems,
      scheduledAt: new Date(scheduledDate),
      message: challengeMessage
    };

    const success = sendTeamChallenge(challengeData);
    if (success) {
      alert(`Challenge sent to ${targetTeam.name}!`);
      setSelectedProblems([]);
      setChallengeMessage('');
      setScheduledDate('');
    } else {
      alert('Failed to send challenge. Please try again.');
    }
  };

  const toggleProblem = (problemId: string) => {
    setSelectedProblems(prev => 
      prev.includes(problemId)
        ? prev.filter(id => id !== problemId)
        : [...prev, problemId]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'Hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Trophy className="w-8 h-8 text-blue-500" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Team Challenge System Demo
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
              <TeamChallengeNotifications />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Team Leaderboard */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Team Leaderboard
              </h2>
              
              <div className="space-y-3">
                {mockTeams.map((team) => (
                  <motion.div
                    key={team.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      team.isMyTeam 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          team.rank === 1 ? 'bg-yellow-500' : 
                          team.rank === 2 ? 'bg-gray-400' : 
                          team.rank === 3 ? 'bg-orange-500' : 'bg-gray-600'
                        }`}>
                          {team.rank}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                            {team.name}
                            {team.isMyTeam && <Star className="w-4 h-4 ml-1 text-blue-500" />}
                          </h3>
                          <p className="text-sm text-gray-500">{team.members} members</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{team.rating}</p>
                        <p className="text-xs text-gray-500">rating</p>
                      </div>
                    </div>
                    
                    {!team.isMyTeam && (
                      <button
                        onClick={() => handleSendChallenge(team.id)}
                        disabled={!selectedProblems.length || !scheduledDate}
                        className="w-full mt-3 px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        Challenge Team
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Challenge Setup */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-6">
              {/* Battle Mode Selection */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Select Battle Mode
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {battleModes.map((mode) => (
                    <motion.button
                      key={mode.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedBattleMode(mode.name)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedBattleMode === mode.name
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-lg ${mode.color} flex items-center justify-center text-white mx-auto mb-3`}>
                        {mode.icon}
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{mode.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{mode.description}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Problem Selection */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Select Problems ({selectedProblems.length} selected)
                </h2>
                
                <div className="space-y-2">
                  {mockProblems.map((problem) => (
                    <motion.label
                      key={problem.id}
                      whileHover={{ scale: 1.01 }}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedProblems.includes(problem.id)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProblems.includes(problem.id)}
                        onChange={() => toggleProblem(problem.id)}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 dark:text-white">{problem.name}</h3>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                              {problem.difficulty}
                            </span>
                            <span className="text-sm text-gray-500">{problem.points} pts</span>
                          </div>
                        </div>
                      </div>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Schedule & Message */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Schedule & Message
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Schedule Battle
                    </label>
                    <input
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Challenge Message (Optional)
                    </label>
                    <textarea
                      value={challengeMessage}
                      onChange={(e) => setChallengeMessage(e.target.value)}
                      placeholder="Add a message to your challenge..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Notifications Display */}
        {notifications.length > 0 && (
          <div className="mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Recent Challenge Activity ({notifications.length})
              </h2>
              
              <div className="space-y-2">
                {notifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.challengeId}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {notification.type === 'sent' && `Challenge sent to ${notification.toTeam?.name}`}
                        {notification.type === 'received' && `Challenge received from ${notification.fromTeam.name}`}
                        {notification.type === 'accepted' && `Challenge accepted by ${notification.acceptedBy}`}
                        {notification.type === 'declined' && `Challenge declined by ${notification.declinedBy}`}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
