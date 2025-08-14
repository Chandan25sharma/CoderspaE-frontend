'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { 
  MessageCircle, 
  Send, 
  X,
  User,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface DirectMessage {
  _id: string;
  from: {
    username: string;
    name: string;
    avatar?: string;
  };
  to: {
    username: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface DirectMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: {
    id: string;
    username: string;
    name: string;
    avatar?: string;
  };
}

const DirectMessageModal: React.FC<DirectMessageModalProps> = ({ 
  isOpen, 
  onClose, 
  targetUser 
}) => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && targetUser) {
      fetchMessages();
      // Poll for new messages every 5 seconds
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, targetUser]);

  const fetchMessages = async () => {
    if (!session || !targetUser) return;

    try {
      const response = await fetch(`/api/messages/direct?with=${targetUser.username}&limit=50`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching direct messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !session || !targetUser) return;

    setLoading(true);
    try {
      const response = await fetch('/api/messages/direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: targetUser.username,
          content: newMessage
        })
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages(); // Refresh messages
      }
    } catch (error) {
      console.error('Error sending direct message:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`bg-gray-900 rounded-lg shadow-2xl border border-gray-700 ${
            isMinimized ? 'w-96 h-16' : 'w-96 h-[500px]'
          } flex flex-col overflow-hidden`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">
                  {targetUser.name || targetUser.username}
                </h3>
                <p className="text-gray-400 text-xs">@{targetUser.username}</p>
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
                onClick={onClose}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm py-8">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isFromMe = message.from.username === session?.user?.name;
                    return (
                      <div key={message._id} className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs px-4 py-2 rounded-lg ${
                          isFromMe 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-700 text-gray-100'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            isFromMe ? 'text-blue-200' : 'text-gray-400'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
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
                      placeholder={`Message ${targetUser.username}...`}
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
      </motion.div>
    </AnimatePresence>
  );
};

export default DirectMessageModal;
