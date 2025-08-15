'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/hooks/useSocket';
import { useRouter } from 'next/navigation';
import { 
  Clock, 
  Users, 
  Zap, 
  CheckCircle,
  X,
  Trophy,
  Timer,
  Crown
} from 'lucide-react';
import Image from 'next/image';

interface QuickLobbyProps {
  isOpen: boolean;
  onClose: () => void;
  battleMode: string;
  type: 'single' | 'team';
  teamData?: {
    id: string;
    name: string;
    members: Array<{
      id: string;
      username: string;
      avatar?: string;
    }>;
  };
}

const QuickLobby: React.FC<QuickLobbyProps> = ({
  isOpen,
  onClose,
  battleMode,
  type,
  teamData
}) => {
  const { data: session } = useSession();
  const { socket } = useSocket();
  const router = useRouter();
  
  const [status, setStatus] = useState<'joining' | 'waiting' | 'matched' | 'countdown' | 'starting'>('joining');
  const [lobbyId, setLobbyId] = useState<string>('');
  const [participants, setParticipants] = useState<any[]>([]);
  const [problems, setProblems] = useState<any[]>([]);
  const [countdown, setCountdown] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen || !socket || !session?.user) return;

    // Join quick lobby
    const joinData = {
      userId: session.user.id,
      username: session.user.name,
      avatar: session.user.image,
      battleMode,
      type,
      ...(type === 'team' && teamData && {
        teamId: teamData.id,
        teamName: teamData.name,
        teamMembers: teamData.members
      })
    };

    socket.emit('join-quick-lobby', joinData);

    // Socket event listeners
    socket.on('lobby-joined', (data) => {
      setLobbyId(data.lobbyId);
      setParticipants(data.participants);
      setStatus(data.status === 'waiting' ? 'waiting' : 'matched');
    });

    socket.on('match-found', (data) => {
      setStatus('matched');
      setParticipants(data.participants);
      setProblems(data.problems);
    });

    socket.on('start-countdown', (data) => {
      setStatus('countdown');
      setCountdown(data.countdown);
      
      // Start countdown timer
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    });

    socket.on('battle-started', (data) => {
      setStatus('starting');
      setTimeout(() => {
        router.push(data.redirectUrl);
      }, 1000);
    });

    return () => {
      socket.off('lobby-joined');
      socket.off('match-found');
      socket.off('start-countdown');
      socket.off('battle-started');
    };
  }, [isOpen, socket, session, battleMode, type, teamData, router]);

  const handleAcceptMatch = () => {
    if (!socket || !lobbyId) return;
    
    setIsReady(true);
    socket.emit('accept-match', { lobbyId });
  };

  const handleLeaveLobby = () => {
    if (socket && lobbyId) {
      socket.emit('leave-lobby', { lobbyId });
    }
    onClose();
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
          onClick={handleLeaveLobby}
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Quick Match
                  </h3>
                  <p className="text-gray-400">
                    {battleMode} • {type === 'single' ? '1v1' : 'Team Battle'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLeaveLobby}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {status === 'joining' && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Joining Lobby...
                  </h4>
                  <p className="text-gray-400">
                    Setting up your quick match
                  </p>
                </div>
              </div>
            )}

            {status === 'waiting' && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8 text-yellow-400 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Waiting for {type === 'single' ? 'Opponent' : 'Another Team'}...
                  </h4>
                  <p className="text-gray-400">
                    {type === 'single' 
                      ? 'Looking for another player to battle with' 
                      : 'Searching for another team to challenge'
                    }
                  </p>
                </div>

                {participants.length > 0 && (
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <h5 className="text-white font-medium mb-3">In Lobby:</h5>
                    <div className="space-y-2">
                      {participants.map((participant) => (
                        <div key={participant.userId || participant.teamId} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                            {participant.avatar ? (
                              <Image 
                                src={participant.avatar} 
                                alt={participant.username || participant.teamName}
                                width={32}
                                height={32}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-xs text-white">
                                {(participant.username || participant.teamName)[0].toUpperCase()}
                              </span>
                            )}
                          </div>
                          <span className="text-gray-300">
                            {participant.username || participant.teamName}
                            {type === 'team' && ` (${participant.members?.length || 0} members)`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {status === 'matched' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Match Found!
                  </h4>
                  <p className="text-gray-400">
                    {type === 'single' ? 'Opponent found' : 'Another team is ready to battle'}
                  </p>
                </div>

                {/* Participants */}
                <div className="grid grid-cols-2 gap-4">
                  {participants.map((participant, index) => (
                    <div key={participant.userId || participant.teamId} 
                         className={`p-4 rounded-xl border ${
                           index === 0 ? 'border-blue-500 bg-blue-500/10' : 'border-red-500 bg-red-500/10'
                         }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-blue-500' : 'bg-red-500'
                        }`}>
                          {participant.avatar ? (
                            <Image 
                              src={participant.avatar} 
                              alt={participant.username || participant.teamName}
                              width={40}
                              height={40}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-medium">
                              {(participant.username || participant.teamName)[0].toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {participant.username || participant.teamName}
                          </p>
                          {type === 'team' && (
                            <p className="text-xs text-gray-400">
                              {participant.members?.length || 0} members
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Problems */}
                {problems.length > 0 && (
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <h5 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      Battle Problems:
                    </h5>
                    <div className="space-y-2">
                      {problems.map((problem, index) => (
                        <div key={problem.id} className="flex items-center justify-between">
                          <span className="text-gray-300">{problem.title}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">
                              {problem.timeLimit / 60} min
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              problem.difficulty === 'easy' ? 'text-green-400 bg-green-400/10' :
                              problem.difficulty === 'medium' ? 'text-yellow-400 bg-yellow-400/10' :
                              'text-red-400 bg-red-400/10'
                            }`}>
                              {problem.difficulty}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleLeaveLobby}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Leave Lobby
                  </button>
                  <button
                    onClick={handleAcceptMatch}
                    disabled={isReady}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isReady ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Ready!
                      </>
                    ) : (
                      'Accept Match'
                    )}
                  </button>
                </div>
              </div>
            )}

            {status === 'countdown' && (
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-gray-600 rounded-full mx-auto" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">{countdown}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Battle Starting Soon!
                  </h4>
                  <p className="text-gray-400">
                    Get ready to code! Battle begins in {countdown} seconds.
                  </p>
                </div>
              </div>
            )}

            {status === 'starting' && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Crown className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Battle Started!
                  </h4>
                  <p className="text-gray-400">
                    Redirecting to battle arena...
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickLobby;
