'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/hooks/useSocket';
import { 
  Clock, 
  Users, 
  Calendar,
  CheckCircle,
  Timer,
  Trophy,
  Shield,
  Sword
} from 'lucide-react';
import Image from 'next/image';

interface TeamChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetTeam: {
    id: string;
    name: string;
    leader: {
      id: string;
      username: string;
      avatar?: string;
    };
    members: Array<{
      id: string;
      username: string;
      avatar?: string;
    }>;
    stats: {
      wins: number;
      losses: number;
      totalBattles: number;
    };
  };
  challengerTeam: {
    id: string;
    name: string;
    members: Array<{
      id: string;
      username: string;
      avatar?: string;
    }>;
  };
  battleMode: string;
  problems: Array<{
    id: string;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    timeLimit?: number;
  }>;
}

const TeamChallengeModal: React.FC<TeamChallengeModalProps> = ({
  isOpen,
  onClose,
  targetTeam,
  challengerTeam,
  battleMode,
  problems
}) => {
  const { data: session } = useSession();
  const { socket } = useSocket();
  
  const [step, setStep] = useState<'select-problems' | 'schedule-time' | 'sending' | 'sent'>('select-problems');
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [scheduledDateTime, setScheduledDateTime] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [challengeId, setChallengeId] = useState<string>('');

  const maxProblems = battleMode === 'Team Clash' ? 3 : 2;

  const difficultyColors = {
    easy: 'text-green-400 bg-green-400/10',
    medium: 'text-yellow-400 bg-yellow-400/10',
    hard: 'text-red-400 bg-red-400/10'
  };

  const handleProblemToggle = (problemId: string) => {
    setSelectedProblems(prev => {
      if (prev.includes(problemId)) {
        return prev.filter(id => id !== problemId);
      } else if (prev.length < maxProblems) {
        return [...prev, problemId];
      }
      return prev;
    });
  };

  const handleSendTeamChallenge = async () => {
    if (!selectedProblems.length || !scheduledDateTime || !socket || !session?.user) return;

    setIsSending(true);
    
    const selectedProblemDetails = problems.filter(p => selectedProblems.includes(p.id));
    
    const challengeData = {
      challengerTeamId: challengerTeam.id,
      challengedTeamId: targetTeam.id,
      problems: selectedProblemDetails.map(p => ({
        id: p.id,
        title: p.title,
        difficulty: p.difficulty,
        timeLimit: p.timeLimit || 60
      })),
      scheduledDateTime: new Date(scheduledDateTime),
      battleMode,
      challengerTeam: {
        id: challengerTeam.id,
        name: challengerTeam.name,
        leader: session.user.name,
        memberCount: challengerTeam.members.length
      }
    };

    socket.emit('teamChallenge:send', challengeData);

    // Listen for response
    socket.on('teamChallenge:sent', (response) => {
      setChallengeId(response.challengeId);
      setStep('sent');
      setIsSending(false);
    });

    socket.on('error', () => {
      setIsSending(false);
      // Handle error
    });
  };

  const resetModal = () => {
    setStep('select-problems');
    setSelectedProblems([]);
    setScheduledDateTime('');
    setIsSending(false);
    setChallengeId('');
  };

  useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen]);

  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1); // At least 1 hour from now
    return now.toISOString().slice(0, 16);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-4xl bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                  <Sword className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Team Challenge: {targetTeam.name}
                  </h3>
                  <p className="text-gray-400">
                    {battleMode} • {targetTeam.stats.wins}W-{targetTeam.stats.losses}L
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {targetTeam.members.length} members
              </div>
            </div>

            {/* Teams Preview */}
            <div className="mt-6 grid grid-cols-2 gap-6">
              {/* Challenger Team */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <h4 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {challengerTeam.name} (Your Team)
                </h4>
                <div className="space-y-2">
                  {challengerTeam.members.slice(0, 4).map((member) => (
                    <div key={member.id} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white">
                        {member.avatar ? (
                          <Image 
                            src={member.avatar} 
                            alt={member.username}
                            width={24}
                            height={24}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          member.username[0].toUpperCase()
                        )}
                      </div>
                      <span className="text-sm text-gray-300">{member.username}</span>
                    </div>
                  ))}
                  {challengerTeam.members.length > 4 && (
                    <div className="text-xs text-gray-400">
                      +{challengerTeam.members.length - 4} more members
                    </div>
                  )}
                </div>
              </div>

              {/* Target Team */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <h4 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
                  <Sword className="w-4 h-4" />
                  {targetTeam.name}
                </h4>
                <div className="space-y-2">
                  {targetTeam.members.slice(0, 4).map((member) => (
                    <div key={member.id} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-xs text-white">
                        {member.avatar ? (
                          <Image 
                            src={member.avatar} 
                            alt={member.username}
                            width={24}
                            height={24}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          member.username[0].toUpperCase()
                        )}
                      </div>
                      <span className="text-sm text-gray-300">{member.username}</span>
                    </div>
                  ))}
                  {targetTeam.members.length > 4 && (
                    <div className="text-xs text-gray-400">
                      +{targetTeam.members.length - 4} more members
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 'select-problems' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Select Problems ({selectedProblems.length}/{maxProblems})
                  </h4>
                  <p className="text-gray-400 mb-4">
                    Choose {maxProblems} problems for this team battle
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {problems.map((problem) => (
                      <motion.button
                        key={problem.id}
                        onClick={() => handleProblemToggle(problem.id)}
                        disabled={!selectedProblems.includes(problem.id) && selectedProblems.length >= maxProblems}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed ${
                          selectedProblems.includes(problem.id)
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                        }`}
                        whileHover={{ scale: selectedProblems.includes(problem.id) || selectedProblems.length < maxProblems ? 1.02 : 1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-white mb-1">
                              {problem.title}
                            </h5>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                difficultyColors[problem.difficulty]
                              }`}>
                                {problem.difficulty}
                              </span>
                              {problem.timeLimit && (
                                <span className="text-gray-400 text-sm">
                                  {problem.timeLimit} min
                                </span>
                              )}
                            </div>
                          </div>
                          {selectedProblems.includes(problem.id) && (
                            <CheckCircle className="w-5 h-5 text-blue-400" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setStep('schedule-time')}
                    disabled={selectedProblems.length === 0}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next: Schedule Battle
                  </button>
                </div>
              </div>
            )}

            {step === 'schedule-time' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Schedule Team Battle
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Battle Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        value={scheduledDateTime}
                        onChange={(e) => setScheduledDateTime(e.target.value)}
                        min={getMinDateTime()}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Battle must be scheduled at least 1 hour in advance
                      </p>
                    </div>

                    {/* Selected Problems Summary */}
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <h5 className="text-white font-medium mb-3">Selected Problems:</h5>
                      <div className="space-y-2">
                        {selectedProblems.map((problemId) => {
                          const problem = problems.find(p => p.id === problemId);
                          return (
                            <div key={problemId} className="flex items-center justify-between">
                              <span className="text-gray-300">{problem?.title}</span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                difficultyColors[problem?.difficulty || 'medium']
                              }`}>
                                {problem?.difficulty}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('select-problems')}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSendTeamChallenge}
                    disabled={!scheduledDateTime || isSending}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isSending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending Challenge...
                      </>
                    ) : (
                      'Send Team Challenge'
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 'sent' && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">
                    Team Challenge Sent!
                  </h4>
                  <p className="text-gray-400">
                    {targetTeam.name}&apos;s leader has been notified of your challenge. 
                    All team members will receive a notification when the battle is accepted.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TeamChallengeModal;
