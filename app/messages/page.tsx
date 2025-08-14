'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { MessageCircle, User, Clock, Target, CheckCircle, X, Timer } from 'lucide-react';

interface ChallengeRequest {
  id: string;
  from: string;
  avatar: string;
  problemTitle: string;
  problemType: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number;
  message: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface ChallengeRequestItemProps {
  request: ChallengeRequest;
  isSelected: boolean;
  onSelect: () => void;
}

const ChallengeRequestItem: React.FC<ChallengeRequestItemProps> = ({ 
  request, 
  isSelected, 
  onSelect 
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400';
      case 'accepted': return 'text-green-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.div
      className={`p-4 rounded-lg cursor-pointer transition-all border ${
        isSelected 
          ? ' ' 
          : 'bg-gray-900 border-white/10 hover:bg-gray-800'
      }`}
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-1 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-medium">{request.from}</h3>
          <p className="text-gray-400 text-xs">{request.timestamp}</p>
        </div>
        <div className={`w-2 h-2 rounded-full ${getDifficultyColor(request.difficulty)}`}></div>
      </div>
      
      <div className="space-y-1">
        <p className="text-gray-300 text-sm truncate">{request.problemTitle}</p>
        <p className="text-gray-400 text-xs">{request.problemType}</p>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium ${getStatusColor(request.status)}`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
          <span className="text-gray-400 text-xs">{request.timeLimit}m</span>
        </div>
      </div>
    </motion.div>
  );
};

export default function ChallengeRequestSidebar() {
  const [selectedRequest, setSelectedRequest] = useState<ChallengeRequest | null>(null);
  const [countdownTime, setCountdownTime] = useState<number | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  // Mock data
  const challengeRequests: ChallengeRequest[] = [
    {
      id: '1',
      from: 'CodeNinja42',
      avatar: '/avatars/ninja.png',
      problemTitle: 'Two Sum Array Challenge',
      problemType: 'Array & Hash Table',
      difficulty: 'Easy',
      timeLimit: 15,
      message: 'Hey! Want to do a quick challenge? I\'ve been practicing arrays lately.',
      timestamp: '2 minutes ago',
      status: 'pending'
    },
    {
      id: '2',
      from: 'AlgoMaster',
      avatar: '/avatars/master.png',
      problemTitle: 'Binary Tree Traversal',
      problemType: 'Tree & Recursion',
      difficulty: 'Medium',
      timeLimit: 25,
      message: 'Let\'s see who can implement tree traversal faster!',
      timestamp: '5 minutes ago',
      status: 'pending'
    },
    {
      id: '3',
      from: 'DynamicProgrammer',
      avatar: '/avatars/dp.png',
      problemTitle: 'Longest Common Subsequence',
      problemType: 'Dynamic Programming',
      difficulty: 'Hard',
      timeLimit: 35,
      message: 'Up for a DP challenge? This one\'s tricky but fun!',
      timestamp: '12 minutes ago',
      status: 'accepted'
    },
    {
      id: '4',
      from: 'StringMaster',
      avatar: '/avatars/string.png',
      problemTitle: 'Valid Parentheses',
      problemType: 'String & Stack',
      difficulty: 'Easy',
      timeLimit: 12,
      message: 'Quick parentheses validation challenge?',
      timestamp: '1 hour ago',
      status: 'rejected'
    }
  ];

  const handleAccept = (request: ChallengeRequest) => {
    // Start countdown timer
    setCountdownTime(5); // 5 second countdown
    
    const countdown = setInterval(() => {
      setCountdownTime(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdown);
          // Navigate to battle
          window.location.href = `/battle/live?problem=${request.id}&opponent=${request.from}`;
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSchedule = (request: ChallengeRequest) => {
    setShowScheduleModal(true);
  };

  const confirmSchedule = () => {
    if (!scheduleDate || !scheduleTime) {
      alert('Please select both date and time');
      return;
    }
    
    const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    const now = new Date();
    
    if (scheduledDateTime <= now) {
      alert('Please select a future date and time');
      return;
    }
    
    // TODO: Send schedule confirmation to opponent
    console.log('Challenge scheduled for:', scheduledDateTime);
    setShowScheduleModal(false);
    alert('Challenge scheduled successfully! You will be notified when it\'s time.');
  };

  const handleReject = (request: ChallengeRequest) => {
    // Update request status to rejected
    console.log('Rejected challenge from', request.from);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
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
          <div className="flex items-center gap-3 mb-2">
           
            <h1 className="text-3xl font-bold text-white">Challenge Requests</h1>
          </div>
          <p className="text-gray-400">Manage incoming battle challenges and respond to opponents</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 h-[calc(100vh-200px)]">
          {/* Left Sidebar - Request List */}
          <motion.div
            className="lg:col-span-1 bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">Requests</h2>
            <div className="space-y-3 max-h-full overflow-y-auto">
              {challengeRequests.map((request) => (
                <ChallengeRequestItem
                  key={request.id}
                  request={request}
                  isSelected={selectedRequest?.id === request.id}
                  onSelect={() => setSelectedRequest(request)}
                />
              ))}
            </div>
          </motion.div>

          {/* Right Main Panel - Request Details */}
          <motion.div
            className="lg:col-span-2 bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {selectedRequest ? (
              <div className="h-full flex flex-col">
                {/* Request Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedRequest.from}</h2>
                      <p className="text-gray-400">{selectedRequest.timestamp}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedRequest.difficulty)}`}>
                    {selectedRequest.difficulty}
                  </span>
                </div>

                {/* Problem Details */}
                <div className="bg-gray-700/50 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-semibold text-white mb-4">{selectedRequest.problemTitle}</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">Problem Type:</span>
                      <span className="text-white font-medium">{selectedRequest.problemType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">Time Limit:</span>
                      <span className="text-white font-medium">{selectedRequest.timeLimit} minutes</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-600/30 rounded-lg">
                    <p className="text-gray-300 italic">&ldquo;{selectedRequest.message}&rdquo;</p>
                  </div>
                </div>

                {/* Countdown Timer */}
                {countdownTime !== null && (
                  <motion.div
                    className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-6 mb-6 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Timer className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <h3 className="text-xl font-bold text-white mb-2">Challenge Accepted!</h3>
                    <p className="text-blue-400 mb-4">Redirecting to battle in:</p>
                    <div className="text-4xl font-bold text-white">{countdownTime}</div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                {selectedRequest.status === 'pending' && countdownTime === null && (
                  <div className="space-y-4 mt-auto">
                    <div className="flex gap-4">
                      <motion.button
                        onClick={() => handleAccept(selectedRequest)}
                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-green-950 to-green-700 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Accept Now
                      </motion.button>
                      <motion.button
                        onClick={() => handleSchedule(selectedRequest)}
                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-950 to-blue-800 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Clock className="w-5 h-5" />
                        Schedule
                      </motion.button>
                    </div>
                    <motion.button
                      onClick={() => handleReject(selectedRequest)}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-950 to-red-700 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <X className="w-5 h-5" />
                      Reject
                    </motion.button>
                  </div>
                )}
                
                {selectedRequest.status !== 'pending' && (
                  <div className="mt-auto p-4 bg-gray-700/50 rounded-xl text-center">
                    <p className="text-gray-400">
                      This challenge has been {selectedRequest.status}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No Request Selected</h3>
                  <p className="text-gray-500">Select a challenge request from the sidebar to view details</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Schedule Modal */}
        {showScheduleModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowScheduleModal(false)}
          >
            <motion.div
              className="bg-gray-800 rounded-2xl border border-white/10 max-w-md w-full p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Schedule Challenge</h3>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Time</label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <p className="text-blue-400 text-sm">
                    ⏰ The challenge will automatically start at the scheduled time. Both participants will be notified.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSchedule}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Confirm Schedule
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
