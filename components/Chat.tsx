'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Smile, MessageCircle, Users } from 'lucide-react';

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'system' | 'emote';
  emote?: string;
}

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onSendEmote: (emote: string) => void;
  userCount: number;
  isSpectator?: boolean;
  disabled?: boolean;
  className?: string;
}

const emotes = [
  { code: ':fire:', display: '🔥', name: 'Fire' },
  { code: ':clap:', display: '👏', name: 'Clap' },
  { code: ':mind_blown:', display: '🤯', name: 'Mind Blown' },
  { code: ':thinking:', display: '🤔', name: 'Thinking' },
  { code: ':rocket:', display: '🚀', name: 'Rocket' },
  { code: ':trophy:', display: '🏆', name: 'Trophy' },
  { code: ':bug:', display: '🐛', name: 'Bug' },
  { code: ':lightning:', display: '⚡', name: 'Lightning' },
];

const Chat: React.FC<ChatProps> = ({
  messages,
  onSendMessage,
  onSendEmote,
  userCount,
  isSpectator = false,
  disabled = false,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showEmotes, setShowEmotes] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmoteClick = (emote: typeof emotes[0]) => {
    if (!disabled) {
      onSendEmote(emote.code);
      setShowEmotes(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessage = (msg: ChatMessage) => {
    const isSystemMessage = msg.type === 'system';
    const isEmote = msg.type === 'emote';

    return (
      <motion.div
        key={msg.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mb-2 ${isSystemMessage ? 'text-center' : ''}`}
      >
        {isSystemMessage ? (
          <div className="text-xs text-gray-400 italic">
            {msg.message}
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {msg.user[0].toUpperCase()}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-white">{msg.user}</span>
                <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
              </div>
              {isEmote ? (
                <div className="text-lg">{msg.emote}</div>
              ) : (
                <div className="text-sm text-gray-300 break-words">{msg.message}</div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-lg flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <MessageCircle className="text-blue-400" size={18} />
          <h3 className="font-semibold text-white">
            {isSpectator ? 'Spectator Chat' : 'Battle Chat'}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-sm">
          <Users size={14} />
          <span>{userCount}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 min-h-0">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            {isSpectator ? 'Join the spectator conversation!' : 'Start chatting with your opponent!'}
          </div>
        ) : (
          messages.map(renderMessage)
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!disabled && (
        <div className="p-3 border-t border-gray-800">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isSpectator ? "Chat with spectators..." : "Type a message..."}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                maxLength={200}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                {inputValue.length}/200
              </div>
            </div>
            
            {/* Emote Button */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowEmotes(!showEmotes)}
                className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <Smile size={18} />
              </motion.button>

              {/* Emotes Panel */}
              <AnimatePresence>
                {showEmotes && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute bottom-full right-0 mb-2 bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg z-50"
                  >
                    <div className="grid grid-cols-4 gap-2">
                      {emotes.map((emote) => (
                        <motion.button
                          key={emote.code}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEmoteClick(emote)}
                          className="p-2 text-lg hover:bg-gray-700 rounded transition-colors"
                          title={emote.name}
                        >
                          {emote.display}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Send Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <Send size={18} />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
