'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

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

interface ChallengeResponse {
  challengeId: string;
  response: 'accepted' | 'rejected';
  matchId?: string;
}

interface MatchUpdate {
  matchId: string;
  status: 'waiting' | 'in-progress' | 'completed';
  participants: Array<{
    userId: string;
    username: string;
    progress: number;
    score: number;
    currentProblem: number;
  }>;
  spectatorCount: number;
}

export const useSocket = () => {
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [incomingChallenge, setIncomingChallenge] = useState<ChallengeRequest | null>(null);
  const [activeMatch, setActiveMatch] = useState<MatchUpdate | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    // Initialize Socket.IO connection
    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001', {
      auth: {
        userId: session.user.id,
        username: session.user.name,
      },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      setIsConnected(true);
      // Join user's personal room for direct challenges
      socket.emit('join-user-room', session.user.id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
      setIsConnected(false);
    });

    // Challenge event handlers
    socket.on('challenge-request', (challengeData: ChallengeRequest) => {
      console.log('Received challenge request:', challengeData);
      setIncomingChallenge(challengeData);
    });

    socket.on('challenge-response', (response: ChallengeResponse) => {
      console.log('Challenge response received:', response);
      if (response.response === 'accepted' && response.matchId) {
        // Navigate to match room
        window.location.href = `/battle/live/${response.matchId}`;
      }
    });

    socket.on('match-update', (matchData: MatchUpdate) => {
      console.log('Match update received:', matchData);
      setActiveMatch(matchData);
    });

    socket.on('challenge-expired', (challengeId: string) => {
      console.log('Challenge expired:', challengeId);
      setIncomingChallenge(null);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [session?.user?.id, session?.user?.name]);

  // Send challenge request
  const sendChallenge = (targetUserId: string, problems: string[], timeLimit: number = 30) => {
    if (!socketRef.current || !session?.user) return;

    const challengeData = {
      challengerId: session.user.id,
      challengerName: session.user.name,
      challengerAvatar: session.user.image || '/default-avatar.png',
      targetId: targetUserId,
      problems,
      timeLimit,
    };

    console.log('Sending challenge:', challengeData);
    socketRef.current.emit('send-challenge', challengeData);
  };

  // Respond to challenge
  const respondToChallenge = (challengeId: string, response: 'accepted' | 'rejected') => {
    if (!socketRef.current) return;

    console.log('Responding to challenge:', challengeId, response);
    socketRef.current.emit('challenge-response', {
      challengeId,
      response,
    });

    // Clear the incoming challenge
    setIncomingChallenge(null);
  };

  // Join match room as participant
  const joinMatchRoom = (matchId: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit('join-match', matchId);
  };

  // Join match room as spectator
  const spectateMatch = (matchId: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit('spectate-match', matchId);
  };

  // Send code update during match
  const sendCodeUpdate = (matchId: string, code: string, problemIndex: number) => {
    if (!socketRef.current) return;
    socketRef.current.emit('code-update', {
      matchId,
      code,
      problemIndex,
      userId: session?.user?.id,
    });
  };

  // Submit solution during match
  const submitSolution = (matchId: string, problemIndex: number, code: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit('submit-solution', {
      matchId,
      problemIndex,
      code,
      userId: session?.user?.id,
    });
  };

  return {
    socket: socketRef.current,
    isConnected,
    incomingChallenge,
    activeMatch,
    sendChallenge,
    respondToChallenge,
    joinMatchRoom,
    spectateMatch,
    sendCodeUpdate,
    submitSolution,
    clearIncomingChallenge: () => setIncomingChallenge(null),
  };
};
