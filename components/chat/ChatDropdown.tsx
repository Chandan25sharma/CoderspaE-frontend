'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { 
  MessageCircle, 
  Send, 
  Users, 
  Hash, 
  ChevronDown, 
  Smile,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface Message {
  _id: string;
  user: {
    username: string;
    name: string;
    avatar?: string;
  };
  content: string;
  channel: string;
  timestamp: Date;
  type: 'text' | 'system' | 'challenge';
  metadata?: {
    challengeId?: string;
    problemId?: string;
    battleMode?: string;
  };
}

interface ChatDropdownProps {
  battleMode?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

const ChatDropdown: React.FC<ChatDropdownProps> = ({ 
  battleMode = 'general', 
  position = 'bottom-right' 
}) => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentChannel, setCurrentChannel] = useState('general');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channels = [
    { id: 'general', name: 'General', icon: Hash, color: '#6b7280' },
    { id: 'battles', name: 'Battles', icon: Users, color: '#ef4444' },
    { id: `${battleMode}-chat`, name: `${battleMode} Chat`, icon: MessageCircle, color: '#3b82f6' },
    { id: 'help', name: 'Help', icon: MessageCircle, color: '#10b981' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      fetchOnlineUsers();
      // Set up polling for real-time updates
      const interval = setInterval(() => {
        fetchMessages();
        fetchOnlineUsers();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, currentChannel]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/community/messages?channel=${currentChannel}&limit=50`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchOnlineUsers = async () => {
    try {
      const response = await fetch('/api/users?isOnline=true&limit=1');
      const data = await response.json();
      if (data.success && data.pagination) {
        setOnlineUsers(data.pagination.total || 0);
      }
    } catch (error) {
      console.error('Error fetching online users:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !session) return;

    setLoading(true);
    try {
      const response = await fetch('/api/community/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage,
          channel: currentChannel,
          type: 'text'
        })
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages(); // Refresh messages
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendChallengeMessage = async (challengeData: {
    challengedUser: string;
    problemTitle: string;
    battleMode: string;
  }) => {
    if (!session) return;

    try {
      const response = await fetch('/api/community/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `🔥 ${session.user?.name} challenged ${challengeData.challengedUser} to a ${challengeData.battleMode} battle with problem: "${challengeData.problemTitle}"`,
          channel: 'battles',
          type: 'challenge',
          metadata: {
            battleMode: challengeData.battleMode,
            problemTitle: challengeData.problemTitle
          }
        })
      });

      if (response.ok && currentChannel === 'battles') {
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending challenge message:', error);
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      default:
        return 'bottom-4 right-4';
    }
  };

  // Expose the sendChallengeMessage function globally
  useEffect(() => {
    (window as any).sendChallengeMessage = sendChallengeMessage;
  }, [session]);

  return (
    <div className={`fixed ${getPositionClasses()} z-50`}>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <MessageCircle className="w-6 h-6" />
          {onlineUsers > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {onlineUsers}
            </span>
          )}
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`bg-gray-900 rounded-lg shadow-2xl border border-gray-700 ${
              isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
            } flex flex-col overflow-hidden`}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="text-white font-semibold text-sm">Community Chat</h3>
                  <p className="text-gray-400 text-xs">{onlineUsers} online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Channel Selector */}
                <div className="bg-gray-800 p-2 border-b border-gray-700">
                  <select
                    value={currentChannel}
                    onChange={(e) => setCurrentChannel(e.target.value)}
                    className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {channels.map(channel => (
                      <option key={channel.id} value={channel.id}>
                        #{channel.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((message) => (
                    <div key={message._id} className="flex gap-3">
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {message.user.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium text-sm">
                            {message.user.username}
                          </span>
                          <span className="text-gray-400 text-xs">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <p className={`text-sm ${
                          message.type === 'challenge' ? 'text-yellow-400 font-medium' : 'text-gray-300'
                        }`}>
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                {session && (
                  <div className="p-4 border-t border-gray-700">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder={`Message #${channels.find(c => c.id === currentChannel)?.name}...`}
                        className="flex-1 bg-gray-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={loading || !newMessage.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded p-2 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatDropdown;
