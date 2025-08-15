'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/hooks/useSocket';
import { 
  MessageCircle, 
  User, 
  Users, 
  Clock, 
  Target, 
  CheckCircle, 
  X, 
  Timer,
  Send,
  Hash,
  UserPlus,
  Search,
  Settings,
  MoreVertical,
  Phone,
  Video,
  Info
} from 'lucide-react';
import Image from 'next/image';

interface PersonalChat {
  chatId: string;
  otherUser: {
    id: string;
    username: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'in-battle';
  };
  lastMessage?: {
    content: string;
    type: 'text' | 'challenge' | 'system';
    timestamp: string;
    senderId: string;
  };
  unreadCount: number;
  lastUpdated: string;
}

interface CommunityRoom {
  _id: string;
  roomName: string;
  description?: string;
  battleMode?: string;
  memberCount: number;
}

interface Message {
  senderId: string;
  senderUsername?: string;
  content: string;
  type: 'text' | 'challenge' | 'system' | 'join' | 'leave';
  challengeId?: string;
  timestamp: string;
  isRead?: boolean;
}

interface ChallengeMessage extends Message {
  type: 'challenge';
  challengeId: string;
  challengeData?: {
    problemTitle: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    timeLimit: number;
    status: 'pending' | 'accepted' | 'rejected';
  };
}

const MessagesPage: React.FC = () => {
  const { data: session } = useSession();
  const { socket, isConnected } = useSocket();
  
  // State management
  const [activeTab, setActiveTab] = useState<'personal' | 'community'>('personal');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [personalChats, setPersonalChats] = useState<PersonalChat[]>([]);
  const [communityRooms, setCommunityRooms] = useState<CommunityRoom[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Current chat/room info
  const [currentChatInfo, setCurrentChatInfo] = useState<{
    type: 'personal' | 'community';
    name: string;
    description?: string;
    memberCount?: number;
    otherUser?: any;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket event handlers
  useEffect(() => {
    if (!socket || !session?.user?.id) return;

    // Join user room for real-time updates
    socket.emit('join-user-room', session.user.id, session.user.name);

    // Personal chat events
    socket.on('personal-chats-list', (data: { chats: PersonalChat[] }) => {
      setPersonalChats(data.chats);
    });

    socket.on('personal-chat-joined', (data: { 
      chatId: string; 
      otherUser: any; 
      messages: Message[]; 
      unreadCount: number; 
    }) => {
      setMessages(data.messages);
      setCurrentChatInfo({
        type: 'personal',
        name: data.otherUser.username,
        otherUser: data.otherUser
      });
      if (data.unreadCount > 0) {
        socket.emit('mark-messages-read', { chatId: data.chatId });
      }
    });

    socket.on('receive-personal-message', (data: { chatId: string; message: Message }) => {
      if (selectedChat === data.chatId) {
        setMessages(prev => [...prev, data.message]);
        socket.emit('mark-messages-read', { chatId: data.chatId });
      }
      // Update chat list
      socket.emit('get-personal-chats');
    });

    // Community chat events
    socket.on('community-rooms-list', (data: { rooms: CommunityRoom[] }) => {
      setCommunityRooms(data.rooms);
    });

    socket.on('community-room-joined', (data: {
      roomId: string;
      roomName: string;
      description?: string;
      battleMode?: string;
      messages: Message[];
      membersOnline: number;
      memberCount: number;
    }) => {
      setMessages(data.messages);
      setCurrentChatInfo({
        type: 'community',
        name: data.roomName,
        description: data.description,
        memberCount: data.membersOnline
      });
    });

    socket.on('receive-community-message', (data: { roomId: string; message: Message }) => {
      if (selectedRoom === data.roomId) {
        setMessages(prev => [...prev, data.message]);
      }
    });

    socket.on('room-member-update', (data: { roomId: string; memberCount: number }) => {
      if (selectedRoom === data.roomId && currentChatInfo) {
        setCurrentChatInfo(prev => prev ? { ...prev, memberCount: data.memberCount } : null);
      }
    });

    socket.on('chat-error', (data: { message: string }) => {
      console.error('Chat error:', data.message);
      // Show error notification
    });

    // Load initial data
    socket.emit('get-personal-chats');
    socket.emit('get-community-rooms');

    return () => {
      socket.off('personal-chats-list');
      socket.off('personal-chat-joined');
      socket.off('receive-personal-message');
      socket.off('community-rooms-list');
      socket.off('community-room-joined');
      socket.off('receive-community-message');
      socket.off('room-member-update');
      socket.off('chat-error');
    };
  }, [socket, session, selectedChat, selectedRoom, currentChatInfo]);

  // Handle personal chat selection
  const handlePersonalChatSelect = (chat: PersonalChat) => {
    if (selectedRoom) {
      socket?.emit('leave-community-room', { roomId: selectedRoom });
      setSelectedRoom(null);
    }
    
    setSelectedChat(chat.chatId);
    setIsLoading(true);
    socket?.emit('join-personal-chat', { otherUserId: chat.otherUser.id });
    setIsLoading(false);
  };

  // Handle community room selection
  const handleCommunityRoomSelect = (room: CommunityRoom) => {
    if (selectedChat) {
      setSelectedChat(null);
    }
    
    if (selectedRoom && selectedRoom !== room._id) {
      socket?.emit('leave-community-room', { roomId: selectedRoom });
    }
    
    setSelectedRoom(room._id);
    setIsLoading(true);
    socket?.emit('join-community-room', { roomName: room.roomName });
    setIsLoading(false);
  };

  // Send message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    if (selectedChat) {
      socket.emit('send-personal-message', {
        chatId: selectedChat,
        content: newMessage.trim(),
        type: 'text'
      });
    } else if (selectedRoom) {
      socket.emit('send-community-message', {
        roomId: selectedRoom,
        content: newMessage.trim(),
        type: 'text'
      });
    }

    setNewMessage('');
  };

  // Handle challenge response
  const handleChallengeResponse = (challengeId: string, response: 'accept' | 'decline') => {
    if (!socket) return;

    socket.emit('challenge-response', {
      challengeId,
      response: response === 'accept' ? 'accepted' : 'rejected'
    });
  };

  // Filter functions
  const filteredPersonalChats = personalChats.filter(chat =>
    chat.otherUser.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCommunityRooms = communityRooms.filter(room =>
    room.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Sign in to access messages</h2>
          <p className="text-gray-400">Connect with other coders and join the community!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
          <p className="text-gray-400">Connect with other coders and join community discussions</p>
        </motion.div>

        <div className="flex h-[calc(100vh-200px)] bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700">
          {/* Sidebar */}
          <div className="w-80 bg-gray-900/50 border-r border-gray-700 flex flex-col">
            {/* Tab Navigation */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    activeTab === 'personal'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Personal
                </button>
                <button
                  onClick={() => setActiveTab('community')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    activeTab === 'community'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Hash className="w-4 h-4" />
                  Community
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'personal' ? 'chats' : 'rooms'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Chat/Room List */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'personal' && (
                <div className="p-2">
                  {filteredPersonalChats.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-400">No personal chats yet</p>
                      <p className="text-sm text-gray-500">Challenge someone to start chatting!</p>
                    </div>
                  ) : (
                    filteredPersonalChats.map((chat) => (
                      <motion.div
                        key={chat.chatId}
                        className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                          selectedChat === chat.chatId
                            ? 'bg-blue-600/20 border border-blue-500/30'
                            : 'hover:bg-gray-800/50'
                        }`}
                        onClick={() => handlePersonalChatSelect(chat)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            {chat.otherUser.avatar ? (
                              <Image
                                src={chat.otherUser.avatar}
                                alt={chat.otherUser.username}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-300" />
                              </div>
                            )}
                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${
                              chat.otherUser.status === 'online' ? 'bg-green-400' :
                              chat.otherUser.status === 'in-battle' ? 'bg-yellow-400' : 'bg-gray-500'
                            }`} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-white font-medium truncate">{chat.otherUser.username}</h4>
                              {chat.unreadCount > 0 && (
                                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                  {chat.unreadCount}
                                </span>
                              )}
                            </div>
                            {chat.lastMessage && (
                              <p className="text-sm text-gray-400 truncate">
                                {chat.lastMessage.type === 'challenge' ? (
                                  <span className="flex items-center gap-1">
                                    <Target className="w-3 h-3" />
                                    Challenge sent
                                  </span>
                                ) : (
                                  chat.lastMessage.content
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'community' && (
                <div className="p-2">
                  {filteredCommunityRooms.length === 0 ? (
                    <div className="text-center py-8">
                      <Hash className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-400">No community rooms found</p>
                    </div>
                  ) : (
                    filteredCommunityRooms.map((room) => (
                      <motion.div
                        key={room._id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                          selectedRoom === room._id
                            ? 'bg-blue-600/20 border border-blue-500/30'
                            : 'hover:bg-gray-800/50'
                        }`}
                        onClick={() => handleCommunityRoomSelect(room)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Hash className="w-5 h-5 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-white font-medium">{room.roomName}</h4>
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {room.memberCount}
                              </span>
                            </div>
                            {room.description && (
                              <p className="text-sm text-gray-400 truncate">{room.description}</p>
                            )}
                            {room.battleMode && (
                              <span className="inline-block px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded mt-1">
                                {room.battleMode}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Main Chat Panel */}
          <div className="flex-1 flex flex-col">
            {currentChatInfo ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-700 bg-gray-900/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        {currentChatInfo.type === 'personal' ? (
                          <User className="w-5 h-5 text-white" />
                        ) : (
                          <Hash className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <h2 className="text-white font-semibold">{currentChatInfo.name}</h2>
                        <p className="text-sm text-gray-400">
                          {currentChatInfo.type === 'personal' ? (
                            currentChatInfo.otherUser?.status === 'online' ? 'Online' : 'Offline'
                          ) : (
                            `${currentChatInfo.memberCount} members online`
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {currentChatInfo.type === 'personal' && (
                        <>
                          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                            <Phone className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                            <Video className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                        <Info className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <>
                      {messages.map((message, index) => (
                        <MessageBubble
                          key={index}
                          message={message}
                          isOwn={message.senderId === session.user.id}
                          onChallengeResponse={handleChallengeResponse}
                        />
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-700 bg-gray-900/30">
                  <div className="flex items-center gap-3">
                    <input
                      ref={messageInputRef}
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* No Chat Selected */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Select a chat to start messaging</h3>
                  <p className="text-gray-400">Choose from your personal chats or join a community room</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Message Bubble Component
interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  onChallengeResponse?: (challengeId: string, response: 'accept' | 'decline') => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn, onChallengeResponse }) => {
  const getMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (message.type === 'system' || message.type === 'join' || message.type === 'leave') {
    return (
      <div className="flex justify-center">
        <span className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  if (message.type === 'challenge') {
    const challengeMsg = message as ChallengeMessage;
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs lg:max-w-md ${isOwn ? 'bg-blue-600' : 'bg-purple-600'} rounded-lg p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-white" />
            <span className="text-white font-medium">Challenge</span>
          </div>
          <p className="text-white text-sm mb-3">{message.content}</p>
          
          {challengeMsg.challengeData && (
            <div className="bg-black/20 rounded p-2 mb-3">
              <div className="text-white text-sm font-medium">{challengeMsg.challengeData.problemTitle}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-1 rounded ${
                  challengeMsg.challengeData.difficulty === 'Easy' ? 'bg-green-500' :
                  challengeMsg.challengeData.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                }`}>
                  {challengeMsg.challengeData.difficulty}
                </span>
                <span className="text-xs text-gray-300">
                  <Timer className="w-3 h-3 inline mr-1" />
                  {challengeMsg.challengeData.timeLimit}min
                </span>
              </div>
            </div>
          )}

          {!isOwn && challengeMsg.challengeData?.status === 'pending' && onChallengeResponse && (
            <div className="flex gap-2">
              <button
                onClick={() => onChallengeResponse(challengeMsg.challengeId, 'accept')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded transition-colors flex items-center justify-center gap-1"
              >
                <CheckCircle className="w-4 h-4" />
                Accept
              </button>
              <button
                onClick={() => onChallengeResponse(challengeMsg.challengeId, 'decline')}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 rounded transition-colors flex items-center justify-center gap-1"
              >
                <X className="w-4 h-4" />
                Decline
              </button>
            </div>
          )}

          <div className="text-xs text-gray-200 mt-2">
            {getMessageTime(message.timestamp)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md ${
        isOwn ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'
      } rounded-lg p-3`}>
        {!isOwn && message.senderUsername && (
          <div className="text-xs text-gray-300 mb-1">{message.senderUsername}</div>
        )}
        <p className="text-sm">{message.content}</p>
        <div className="text-xs text-gray-200 mt-1">
          {getMessageTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
