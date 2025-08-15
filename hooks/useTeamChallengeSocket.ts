import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

export interface TeamChallengeNotification {
  challengeId: string;
  fromTeam: {
    id: string;
    name: string;
  };
  toTeam?: {
    id: string;
    name: string;
  };
  battleMode: string;
  problems: string[];
  scheduledAt: Date;
  message?: string;
  timestamp: Date;
  type: 'received' | 'sent' | 'accepted' | 'declined';
  acceptedBy?: string;
  declinedBy?: string;
  reason?: string;
}

export interface TeamChallengeSocketData {
  challengeId: string;
  fromTeam: {
    id: string;
    name: string;
  };
  toTeam: {
    id: string;
    name: string;
  };
  battleMode: string;
  problems: string[];
  scheduledAt: Date;
  message?: string;
}

export const useTeamChallengeSocket = () => {
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<TeamChallengeNotification[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user) return;

    // Initialize socket connection
    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000', {
      path: '/socket.io',
      auth: {
        token: (session as any)?.accessToken || 'dummy-token' // You'll need to implement JWT token generation
      },
      autoConnect: true
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('Connected to team challenge socket');
      setIsConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from team challenge socket');
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Failed to connect to real-time notifications');
      setIsConnected(false);
    });

    // Team challenge events
    socket.on('team-challenge-received', (data: Omit<TeamChallengeNotification, 'type'>) => {
      console.log('Team challenge received:', data);
      setNotifications(prev => [...prev, { ...data, type: 'received' }]);
    });

    socket.on('team-challenge-sent', (data: Omit<TeamChallengeNotification, 'type'>) => {
      console.log('Team challenge sent:', data);
      setNotifications(prev => [...prev, { ...data, type: 'sent' }]);
    });

    socket.on('team-challenge-accepted', (data: Omit<TeamChallengeNotification, 'type'>) => {
      console.log('Team challenge accepted:', data);
      setNotifications(prev => [...prev, { ...data, type: 'accepted' }]);
    });

    socket.on('team-challenge-declined', (data: Omit<TeamChallengeNotification, 'type'>) => {
      console.log('Team challenge declined:', data);
      setNotifications(prev => [...prev, { ...data, type: 'declined' }]);
    });

    socket.on('team-challenge-error', (data: { message: string; error: string }) => {
      console.error('Team challenge error:', data);
      setError(data.message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [session]);

  const sendTeamChallenge = (challengeData: TeamChallengeSocketData) => {
    if (!socketRef.current || !isConnected) {
      setError('Not connected to server');
      return false;
    }

    socketRef.current.emit('send-team-challenge', challengeData);
    return true;
  };

  const acceptTeamChallenge = (challengeId: string, fromTeamId: string, toTeamId: string) => {
    if (!socketRef.current || !isConnected) {
      setError('Not connected to server');
      return false;
    }

    socketRef.current.emit('accept-team-challenge', {
      challengeId,
      fromTeamId,
      toTeamId
    });
    return true;
  };

  const declineTeamChallenge = (challengeId: string, fromTeamId: string, toTeamId: string, reason?: string) => {
    if (!socketRef.current || !isConnected) {
      setError('Not connected to server');
      return false;
    }

    socketRef.current.emit('decline-team-challenge', {
      challengeId,
      fromTeamId,
      toTeamId,
      reason
    });
    return true;
  };

  const joinTeamRoom = (teamId: string) => {
    if (!socketRef.current || !isConnected) {
      setError('Not connected to server');
      return false;
    }

    socketRef.current.emit('join-team-room', { teamId });
    return true;
  };

  const leaveTeamRoom = (teamId: string) => {
    if (!socketRef.current || !isConnected) {
      setError('Not connected to server');
      return false;
    }

    socketRef.current.emit('leave-team-room', { teamId });
    return true;
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const removeNotification = (challengeId: string) => {
    setNotifications(prev => prev.filter(n => n.challengeId !== challengeId));
  };

  const clearError = () => {
    setError(null);
  };

  return {
    isConnected,
    notifications,
    error,
    sendTeamChallenge,
    acceptTeamChallenge,
    declineTeamChallenge,
    joinTeamRoom,
    leaveTeamRoom,
    clearNotifications,
    removeNotification,
    clearError
  };
};

export default useTeamChallengeSocket;
