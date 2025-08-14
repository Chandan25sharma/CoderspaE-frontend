'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Clock, User, X, Check } from 'lucide-react';
import Image from 'next/image';

interface ChallengeRequest {
  challengeId: string;
  challengerId: string;
  challengerName: string;
  challengerAvatar: string;
  targetId: string;
  problems: string[];
  timeLimit: number;
  timestamp: Date;
}

interface ChallengeModalProps {
  challenge: ChallengeRequest | null;
  onAccept: () => void;
  onReject: () => void;
  onClose: () => void;
}

const ChallengeModal: React.FC<ChallengeModalProps> = ({
  challenge,
  onAccept,
  onReject,
  onClose
}) => {
  const [timeRemaining, setTimeRemaining] = useState(30); // 30 seconds to respond
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (challenge) {
      setIsVisible(true);
      setTimeRemaining(30);
      
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            onClose(); // Auto-reject if time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setIsVisible(false);
    }
  }, [challenge, onClose]);

  if (!challenge) return null;

  const handleAccept = () => {
    setIsVisible(false);
    setTimeout(() => onAccept(), 300); // Delay for animation
  };

  const handleReject = () => {
    setIsVisible(false);
    setTimeout(() => onReject(), 300); // Delay for animation
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300); // Delay for animation
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 15 }}
              className="bg-gray-900 border border-amber-500/30 rounded-xl p-6 max-w-md w-full relative shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                  <Sword className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Battle Challenge!
                </h2>
                <p className="text-gray-400">
                  You&apos;ve been challenged to a coding duel
                </p>
              </div>

              {/* Challenger Info */}
              <div className="flex items-center justify-center mb-6 p-4 bg-gray-800/50 rounded-lg">
                <Image
                  src={challenge.challengerAvatar}
                  alt={challenge.challengerName}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="text-white font-semibold flex items-center">
                    <User className="w-4 h-4 mr-2 text-amber-500" />
                    {challenge.challengerName}
                  </p>
                  <p className="text-gray-400 text-sm">wants to battle you!</p>
                </div>
              </div>

              {/* Challenge Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-400">Problems:</span>
                  <span className="text-white font-semibold">{challenge.problems.length}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-400 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Time Limit:
                  </span>
                  <span className="text-white font-semibold">{challenge.timeLimit} min</span>
                </div>
              </div>

              {/* Time Remaining */}
              <div className="mb-6 text-center">
                <div className="text-gray-400 text-sm mb-2">Time to respond:</div>
                <div className="text-2xl font-bold text-amber-500">
                  {timeRemaining}s
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(timeRemaining / 30) * 100}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReject}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Decline
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAccept}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Accept Challenge
                </motion.button>
              </div>

              {/* Warning */}
              <p className="text-xs text-gray-500 text-center mt-4">
                This challenge will expire in {timeRemaining} seconds
              </p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChallengeModal;
