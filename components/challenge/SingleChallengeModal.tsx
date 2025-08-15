'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/hooks/useSocket';
import { 
  Clock, 
  Users, 
  Zap, 
  Calendar,
  CheckCircle,
  Timer,
  Trophy
} from 'lucide-react';
import Image from 'next/image';

interface SingleChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: {
    id: string;
    username: string;
    avatar?: string;
    totalPoints?: number;
    wins?: number;
    losses?: number;
  };
  battleMode: string;
  problems: Array<{
    id: string;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    timeLimit?: number;
  }>;
}

const SingleChallengeModal: React.FC<SingleChallengeModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  battleMode,
  problems
}) => {
  const { data: session } = useSession();
  const { socket } = useSocket();
  
  const [step, setStep] = useState<'select-problem' | 'schedule-time' | 'sending' | 'sent'>('select-problem');
  const [selectedProblem, setSelectedProblem] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [customTime, setCustomTime] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [challengeId, setChallengeId] = useState<string>('');

  const timeOptions = [
    { value: '15', label: '15 minutes', icon: Zap },
    { value: '30', label: '30 minutes', icon: Clock },
    { value: '45', label: '45 minutes', icon: Timer },
    { value: '60', label: '1 hour', icon: Trophy },
    { value: 'custom', label: 'Custom time', icon: Calendar }
  ];

  const difficultyColors = {
    easy: 'text-green-400 bg-green-400/10',
    medium: 'text-yellow-400 bg-yellow-400/10',
    hard: 'text-red-400 bg-red-400/10'
  };

  const handleSendChallenge = async () => {
    if (!selectedProblem || !selectedTime || !socket || !session?.user) return;

    setIsSending(true);
    
    const problem = problems.find(p => p.id === selectedProblem);
    const timeLimit = selectedTime === 'custom' ? parseInt(customTime) : parseInt(selectedTime);
    const proposedDateTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now for immediate challenges

    const challengeData = {
      challengerId: session.user.id,
      challengerUsername: session.user.name,
      challengerAvatar: session.user.image,
      targetUserId: targetUser.id,
      problemId: selectedProblem,
      problem: {
        id: problem?.id,
        title: problem?.title,
        difficulty: problem?.difficulty,
        timeLimit: timeLimit * 60 // Convert to seconds
      },
      mode: battleMode,
      proposedDateTime
    };

    socket.emit('challenge:send', challengeData);

    // Listen for response
    socket.on('challenge:sent', (response) => {
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
    setStep('select-problem');
    setSelectedProblem('');
    setSelectedTime('');
    setCustomTime('');
    setIsSending(false);
    setChallengeId('');
  };

  useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen]);

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
          className="relative w-full max-w-2xl bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                {targetUser.avatar ? (
                  <Image 
                    src={targetUser.avatar} 
                    alt={targetUser.username}
                    width={48}
                    height={48}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Users className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Challenge {targetUser.username}
                </h3>
                <p className="text-gray-400">
                  {battleMode} • {targetUser.totalPoints || 0} points
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 'select-problem' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Select a Problem
                  </h4>
                  <div className="space-y-3">
                    {problems.map((problem) => (
                      <motion.button
                        key={problem.id}
                        onClick={() => setSelectedProblem(problem.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          selectedProblem === problem.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                        }`}
                        whileHover={{ scale: 1.02 }}
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
                          {selectedProblem === problem.id && (
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
                    disabled={!selectedProblem}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next: Set Time
                  </button>
                </div>
              </div>
            )}

            {step === 'schedule-time' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Set Battle Duration
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {timeOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => setSelectedTime(option.value)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedTime === option.value
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <option.icon className="w-5 h-5 text-blue-400" />
                          <span className="text-white font-medium">
                            {option.label}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {selectedTime === 'custom' && (
                    <motion.div
                      className="mt-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <input
                        type="number"
                        placeholder="Enter minutes (15-120)"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        min="15"
                        max="120"
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      />
                    </motion.div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('select-problem')}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSendChallenge}
                    disabled={!selectedTime || (selectedTime === 'custom' && !customTime) || isSending}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isSending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Challenge'
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
                    Challenge Sent!
                  </h4>
                  <p className="text-gray-400">
                    {targetUser.username} has been notified of your challenge. 
                    You&apos;ll receive a notification when they respond.
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

export default SingleChallengeModal;
