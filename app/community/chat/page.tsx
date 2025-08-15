'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Send, Smile, Users, Hash } from 'lucide-react';

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  message: string;
  timestamp: Date;
  edited?: boolean;
  replies?: ChatMessage[];
}

interface OnlineUser {
  id: string;
  username: string;
  avatar: string;
  status: 'online' | 'in-battle' | 'away';
}

const emojis = ['😀', '😂', '😍', '😎', '🤔', '👍', '👎', '❤️', '🔥', '💯', '🚀', '⚡', '🎉', '🏆', '💪', '👏'];

export default function CommunityChat() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeChannel, setActiveChannel] = useState('general');
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
  }, [session, status, router]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load messages and online users
  useEffect(() => {
    if (!session) return;
    
    loadMessages();
    loadOnlineUsers();
    
    // Set up polling for new messages (replace with Socket.IO later)
    const interval = setInterval(() => {
      loadMessages();
      loadOnlineUsers();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [session, activeChannel]);

  const loadMessages = async () => {
    try {
      const response = await fetch(`/api/community/messages?channel=${activeChannel}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOnlineUsers = async () => {
    try {
      const response = await fetch('/api/users/online');
      if (response.ok) {
        const data = await response.json();
        setOnlineUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error loading online users:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !session) return;

    try {
      const response = await fetch('/api/community/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage,
          channel: activeChannel,
        }),
      });

      if (response.ok) {
        setNewMessage('');
        loadMessages(); // Refresh messages
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'in-battle': return 'bg-red-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
<div className="min-h-screen bg-gray-950 text-white">
  <div className="container mx-auto px-4 py-6">
    <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center flex items-center justify-center">
      <Users className="inline mr-2" />
      Community
    </h1>

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 h-[calc(100vh-160px)]">
      {/* Online Users Sidebar */}
      <div className="lg:col-span-1 bg-gray-900 rounded-lg p-4 flex flex-col">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Online Users ({onlineUsers.length})
        </h3>
        <div className="space-y-2 overflow-y-auto flex-1">
          {onlineUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded cursor-pointer"
            >
              <div className="relative">
                <img
                  src={user.avatar || '/default-avatar.png'}
                  alt={user.username}
                  className="w-8 h-8 rounded-full"
                />
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor(
                    user.status
                  )}`}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.username}</span>
                <span className="text-xs text-gray-400 capitalize">{user.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-3 bg-gray-900 rounded-lg flex flex-col">
        {/* Channel Header */}
        <div className="p-3 sm:p-4 border-b border-gray-700 overflow-x-auto">
          <div className="flex space-x-2 sm:space-x-4">
            {['general', 'battles', 'messages', 'help'].map((channel) => (
              <button
                key={channel}
                onClick={() => setActiveChannel(channel)}
                className={`flex items-center px-3 py-1 sm:px-4 sm:py-2 rounded whitespace-nowrap ${
                  activeChannel === channel
                    ? 'bg-blue-800'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <Hash className="h-4 w-4 mr-1" />
                {channel}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
          {loading ? (
            <div className="text-center text-gray-400">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400">
              No messages yet. Be the first to start the conversation!
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="flex space-x-3">
                <img
                  src={message.avatar || '/default-avatar.png'}
                  alt={message.username}
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1 flex-wrap">
                    <span className="font-semibold text-blue-400">{message.username}</span>
                    <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                    {message.edited && <span className="text-xs text-gray-500">(edited)</span>}
                  </div>
                  <div className="text-gray-100 break-words">{message.message}</div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-3 sm:p-4 border-t border-gray-700">
          <div className="flex space-x-2 sm:space-x-3 items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={`Message #${activeChannel}`}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-4 sm:py-2"
              />
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <Smile className="h-5 w-5" />
              </button>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-2 bg-gray-700 rounded-lg p-2 shadow-lg grid grid-cols-8 gap-1 max-w-xs overflow-x-auto">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => addEmoji(emoji)}
                      className="text-lg hover:bg-gray-600 rounded p-1"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-3 py-2 sm:px-4 sm:py-2 rounded-lg"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}
