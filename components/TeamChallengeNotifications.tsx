'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTeamChallengeSocket, TeamChallengeNotification } from '@/hooks/useTeamChallengeSocket';
import { Bell, Check, X, Clock, Users, Trophy, AlertCircle } from 'lucide-react';

interface TeamChallengeNotificationsProps {
  className?: string;
}

export default function TeamChallengeNotifications({ className = '' }: TeamChallengeNotificationsProps) {
  const {
    notifications,
    isConnected,
    error,
    acceptTeamChallenge,
    declineTeamChallenge,
    removeNotification,
    clearError
  } = useTeamChallengeSocket();

  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => n.type === 'received').length);
  }, [notifications]);

  const handleAccept = async (notification: TeamChallengeNotification) => {
    if (notification.type === 'received') {
      const success = acceptTeamChallenge(
        notification.challengeId,
        notification.fromTeam.id,
        notification.toTeam?.id || ''
      );
      
      if (success) {
        removeNotification(notification.challengeId);
        // You might want to redirect to the battle setup or show a success message
      }
    }
  };

  const handleDecline = async (notification: TeamChallengeNotification) => {
    if (notification.type === 'received') {
      const success = declineTeamChallenge(
        notification.challengeId,
        notification.fromTeam.id,
        notification.toTeam?.id || '',
        'Challenge declined'
      );
      
      if (success) {
        removeNotification(notification.challengeId);
      }
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'received':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'sent':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'accepted':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'declined':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getNotificationTitle = (notification: TeamChallengeNotification) => {
    switch (notification.type) {
      case 'received':
        return `Team Challenge from ${notification.fromTeam.name}`;
      case 'sent':
        return `Challenge sent to ${notification.toTeam?.name}`;
      case 'accepted':
        return `Challenge accepted by ${notification.acceptedBy}`;
      case 'declined':
        return `Challenge declined by ${notification.declinedBy}`;
      default:
        return 'Team Challenge Update';
    }
  };

  const getNotificationMessage = (notification: TeamChallengeNotification) => {
    const scheduledDate = new Date(notification.scheduledAt).toLocaleString();
    
    switch (notification.type) {
      case 'received':
        return `${notification.battleMode} battle scheduled for ${scheduledDate}. ${notification.problems.length} problems selected.`;
      case 'sent':
        return `${notification.battleMode} battle scheduled for ${scheduledDate}. Waiting for response.`;
      case 'accepted':
        return `Get ready for ${notification.battleMode} battle on ${scheduledDate}!`;
      case 'declined':
        return notification.reason || 'Challenge was declined.';
      default:
        return notification.message || '';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Connection Status */}
      {!isConnected && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      )}

      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black bg-opacity-25"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Team Challenges
                  </h3>
                  <div className="flex items-center space-x-2">
                    {!isConnected && (
                      <div title="Disconnected">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      </div>
                    )}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                    </div>
                    <button
                      onClick={clearError}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No team challenges yet</p>
                    <p className="text-sm">Challenge other teams to get started!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.challengeId}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {getNotificationTitle(notification)}
                              </h4>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(notification.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {getNotificationMessage(notification)}
                            </p>

                            {notification.message && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 italic">
                                &quot;{notification.message}&quot;
                              </p>
                            )}

                            {/* Action Buttons for Received Challenges */}
                            {notification.type === 'received' && (
                              <div className="flex space-x-2 mt-3">
                                <button
                                  onClick={() => handleAccept(notification)}
                                  className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleDecline(notification)}
                                  className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                >
                                  Decline
                                </button>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => removeNotification(notification.challengeId)}
                            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
