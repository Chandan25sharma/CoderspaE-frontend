'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Eye, 
  Clock, 
  Code, 
  Volume2,
  VolumeX,
  ArrowLeft,
  Maximize,
  Heart
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

interface Participant {
  id: string;
  username: string;
  avatar: string;
  progress: number;
  testsPasssed: number;
  totalTests: number;
  isTyping: boolean;
  code: string;
  language: string;
}

interface BattleData {
  id: string;
  title: string;
  difficulty: string;
  timeRemaining: number;
  participants: Participant[];
  spectatorCount: number;
  problemDescription: string;
  status: 'active' | 'completed' | 'paused';
}

export default function SpectatorPage() {
  const router = useRouter();
  const params = useParams();
  const battleId = params.battleId as string;
  
  const [battleData, setBattleData] = useState<BattleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [likes, setLikes] = useState(42);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    // Mock battle data
    const mockData: BattleData = {
      id: battleId,
      title: 'Two Sum Challenge',
      difficulty: 'Easy',
      timeRemaining: 180, // 3 minutes
      participants: [
        {
          id: '1',
          username: 'CodeMaster42',
          avatar: '/avatars/user1.png',
          progress: 75,
          testsPasssed: 3,
          totalTests: 4,
          isTyping: true,
          code: `function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}`,
          language: 'javascript'
        },
        {
          id: '2',
          username: 'AlgoNinja',
          avatar: '/avatars/user2.png',
          progress: 60,
          testsPasssed: 2,
          totalTests: 4,
          isTyping: false,
          code: `def two_sum(nums, target):
    seen = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in seen:
            return [seen[complement], i]
            
        seen[num] = i
    
    return []`,
          language: 'python'
        }
      ],
      spectatorCount: 157,
      problemDescription: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      status: 'active'
    };

    setBattleData(mockData);
    setSelectedParticipant(mockData.participants[0].id);
    setLoading(false);
  }, [battleId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <motion.div
          className="text-white text-xl"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading Battle...
        </motion.div>
      </div>
    );
  }

  if (!battleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Battle Not Found</h2>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const selectedParticipantData = battleData.participants.find(p => p.id === selectedParticipant);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div>
                <h1 className="text-xl font-bold text-white">{battleData.title}</h1>
                <p className="text-gray-400 text-sm">Spectator Mode</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{battleData.spectatorCount} watching</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="text-lg font-mono text-white">{formatTime(battleData.timeRemaining)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  hasLiked ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                <span>{likes}</span>
              </button>
              
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Participants Sidebar */}
        <div className="w-80 bg-gray-800/30 backdrop-blur-sm border-r border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Participants</h3>
          <div className="space-y-4">
            {battleData.participants.map((participant) => (
              <motion.div
                key={participant.id}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedParticipant === participant.id
                    ? 'bg-blue-600/20 border border-blue-500/50'
                    : 'bg-gray-700/30 hover:bg-gray-700/50'
                }`}
                onClick={() => setSelectedParticipant(participant.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {participant.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{participant.username}</h4>
                    <div className="flex items-center gap-2">
                      {participant.isTyping && (
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-green-400 text-xs">typing...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">{participant.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(participant.progress)}`}
                      style={{ width: `${participant.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{participant.testsPasssed}/{participant.totalTests} tests passed</span>
                    <span className="uppercase">{participant.language}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Code Viewer */}
          <div className="flex-1 p-6">
            {selectedParticipantData && (
              <div className="h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {selectedParticipantData.username}&apos;s Code
                  </h3>
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400 text-sm uppercase">{selectedParticipantData.language}</span>
                  </div>
                </div>
                
                <div className="bg-gray-900 rounded-lg border border-gray-700 h-[calc(100%-60px)] overflow-auto">
                  <pre className="p-4 text-gray-300 text-sm font-mono leading-relaxed">
                    <code>{selectedParticipantData.code}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
