'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Monitor, Users, Eye, ArrowLeft, Crown, Zap, Trophy, Clock } from 'lucide-react';
import Link from 'next/link';
import { CodeExecutor } from '@/components/CodeExecutor';

interface LiveStream {
  id: string;
  title: string;
  players: Array<{
    username: string;
    avatar: string;
    language: string;
    rank: number;
    progress: number;
    testsPasssed: number;
    totalTests: number;
  }>;
  viewers: number;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'live' | 'starting' | 'finished' | 'finishing';
  timeLeft: number;
  problem: {
    title: string;
    description: string;
  };
  streamStarted: Date;
}

export default function LiveViewerPage() {
  const [activeStream, setActiveStream] = useState('1');
  const [selectedPlayer, setSelectedPlayer] = useState(0);

  const [liveStreams] = useState<LiveStream[]>([
    {
      id: '1',
      title: 'CodeClash Championship Finals',
      players: [
        {
          username: 'AlgoMaster',
          avatar: '👑',
          language: 'python',
          rank: 1,
          progress: 85,
          testsPasssed: 7,
          totalTests: 8
        },
        {
          username: 'ByteWarrior',
          avatar: '⚔️',
          language: 'javascript',
          rank: 2,
          progress: 78,
          testsPasssed: 6,
          totalTests: 8
        }
      ],
      viewers: 1247,
      difficulty: 'hard',
      status: 'live',
      timeLeft: 1125, // 18:45
      problem: {
        title: 'Merge K Sorted Lists',
        description: 'Merge k sorted linked lists and return it as one sorted list.'
      },
      streamStarted: new Date(Date.now() - 25 * 60 * 1000) // 25 minutes ago
    },
    {
      id: '2',
      title: 'Speed Coding Challenge',
      players: [
        {
          username: 'FastCoder',
          avatar: '💨',
          language: 'cpp',
          rank: 1,
          progress: 92,
          testsPasssed: 4,
          totalTests: 5
        },
        {
          username: 'QuickType',
          avatar: '⚡',
          language: 'java',
          rank: 2,
          progress: 88,
          testsPasssed: 4,
          totalTests: 5
        }
      ],
      viewers: 892,
      difficulty: 'medium',
      status: 'live',
      timeLeft: 445, // 7:25
      problem: {
        title: 'Binary Tree Maximum Path Sum',
        description: 'Find the maximum path sum in a binary tree.'
      },
      streamStarted: new Date(Date.now() - 12 * 60 * 1000) // 12 minutes ago
    },
    {
      id: '3',
      title: 'AI Battle Arena',
      players: [
        {
          username: 'DeepCode',
          avatar: '',
          language: 'python',
          rank: 1,
          progress: 100,
          testsPasssed: 6,
          totalTests: 6
        },
        {
          username: 'NeuralNet',
          avatar: '',
          language: 'python',
          rank: 2,
          progress: 95,
          testsPasssed: 5,
          totalTests: 6
        }
      ],
      viewers: 634,
      difficulty: 'hard',
      status: 'finishing',
      timeLeft: 67, // 1:07
      problem: {
        title: 'Neural Network Implementation',
        description: 'Implement a simple neural network from scratch.'
      },
      streamStarted: new Date(Date.now() - 38 * 60 * 1000) // 38 minutes ago
    }
  ]);

  const currentStream = liveStreams.find(s => s.id === activeStream) || liveStreams[0];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'hard': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getLanguageColor = (language: string) => {
    switch (language) {
      case 'python': return 'bg-green-500';
      case 'javascript': return 'bg-yellow-500';
      case 'java': return 'bg-orange-500';
      case 'cpp': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/profile" className="flex items-center text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Profile
              </Link>
              <div className="flex items-center space-x-3">
                <Monitor className="w-8 h-8 text-blue-400" />
                <h1 className="text-3xl font-bold text-white">Live Coding Battles</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Start Streaming
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Stream List */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-blue-400" />
              Live Streams
            </h2>
            <div className="space-y-4">
              {liveStreams.map((stream) => (
                <motion.div
                  key={stream.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveStream(stream.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    activeStream === stream.id
                      ? 'bg-blue-600/20 border-blue-400 shadow-lg shadow-blue-400/20'
                      : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white text-sm truncate">{stream.title}</h3>
                    <div className="flex items-center space-x-1 text-xs">
                      <Users className="w-3 h-3" />
                      <span className="text-gray-400">{stream.viewers}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(stream.difficulty)}`}>
                      {stream.difficulty}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTime(stream.timeLeft)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {stream.players.slice(0, 2).map((player, idx) => (
                      <div key={idx} className="flex items-center space-x-1">
                        <span className="text-lg">{player.avatar}</span>
                        <span className="text-xs text-gray-300 truncate max-w-[60px]">{player.username}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Main Viewer */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
              {/* Stream Header */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">{currentStream.title}</h2>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-green-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">LIVE</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{currentStream.viewers} viewers</span>
                    </div>
                  </div>
                </div>

                {/* Problem Info */}
                <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">{currentStream.problem.title}</h3>
                  <p className="text-gray-300 text-sm mb-3">{currentStream.problem.description}</p>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentStream.difficulty)}`}>
                      {currentStream.difficulty}
                    </span>
                    <span className="text-sm text-gray-400 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Time Left: {formatTime(currentStream.timeLeft)}
                    </span>
                  </div>
                </div>

                {/* Player Selector */}
                <div className="flex space-x-2">
                  {currentStream.players.map((player, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedPlayer(idx)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg border transition-all ${
                        selectedPlayer === idx
                          ? 'bg-blue-600/20 border-blue-400'
                          : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <span className="text-2xl">{player.avatar}</span>
                      <div className="text-left">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white">{player.username}</span>
                          {player.rank === 1 && <Crown className="w-4 h-4 text-yellow-400" />}
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <div className={`w-3 h-3 rounded ${getLanguageColor(player.language)}`}></div>
                          <span className="text-gray-400">{player.language}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-green-400">{player.testsPasssed}/{player.totalTests} tests</span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Code Editor View */}
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-white flex items-center">
                      <span className="text-2xl mr-2">{currentStream.players[selectedPlayer].avatar}</span>
                      {currentStream.players[selectedPlayer].username}&apos;s Code
                    </h4>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-gray-400">Progress: {currentStream.players[selectedPlayer].progress}%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-400">Rank #{currentStream.players[selectedPlayer].rank}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${currentStream.players[selectedPlayer].progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Code Editor */}
                <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                  <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded ${getLanguageColor(currentStream.players[selectedPlayer].language)}`}></div>
                      <span className="text-sm font-medium text-gray-300">
                        {currentStream.players[selectedPlayer].language}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span>Tests: {currentStream.players[selectedPlayer].testsPasssed}/{currentStream.players[selectedPlayer].totalTests}</span>
                    </div>
                  </div>
                  
                  <CodeExecutor 
                    language={currentStream.players[selectedPlayer].language} 
                    initialCode={getInitialCode(currentStream.players[selectedPlayer].language)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Chat Section */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-400" />
            Live Chat
          </h3>
          
          <div className="bg-gray-900/50 rounded-lg p-4 h-64 overflow-y-auto mb-4">
            <div className="space-y-3">
              {[
                { user: 'CodeMaster', msg: 'Great approach with the heap!', time: '2 min ago' },
                { user: 'AlgoPro', msg: 'ByteWarrior is catching up fast', time: '1 min ago' },
                { user: 'DevFan', msg: 'This is intense! 🔥', time: '30s ago' },
                { user: 'SpeedCoder', msg: 'AlgoMaster\'s solution is elegant', time: 'now' }
              ].map((chat, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {chat.user[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-white">{chat.user}</span>
                      <span className="text-xs text-gray-500">{chat.time}</span>
                    </div>
                    <p className="text-sm text-gray-300">{chat.msg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Send
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getInitialCode(language: string): string {
  switch (language) {
    case 'python':
      return `# Merge K Sorted Lists - Live Battle Code
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def mergeKLists(lists):
    import heapq
    
    # Using min-heap approach
    heap = []
    
    # Add first node of each list to heap
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst.val, i, lst))
    
    dummy = ListNode(0)
    current = dummy
    
    while heap:
        val, i, node = heapq.heappop(heap)
        current.next = node
        current = current.next
        
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    
    return dummy.next

# Test cases passing: 7/8`;

    case 'javascript':
      return `// Merge K Sorted Lists - Live Battle Code
class ListNode {
    constructor(val, next) {
        this.val = (val === undefined ? 0 : val);
        this.next = (next === undefined ? null : next);
    }
}

var mergeKLists = function(lists) {
    if (!lists || lists.length === 0) return null;
    
    // Divide and conquer approach
    while (lists.length > 1) {
        let mergedLists = [];
        
        for (let i = 0; i < lists.length; i += 2) {
            let l1 = lists[i];
            let l2 = i + 1 < lists.length ? lists[i + 1] : null;
            mergedLists.push(mergeTwoLists(l1, l2));
        }
        
        lists = mergedLists;
    }
    
    return lists[0];
};

function mergeTwoLists(l1, l2) {
    let dummy = new ListNode(0);
    let current = dummy;
    
    while (l1 && l2) {
        if (l1.val <= l2.val) {
            current.next = l1;
            l1 = l1.next;
        } else {
            current.next = l2;
            l2 = l2.next;
        }
        current = current.next;
    }
    
    current.next = l1 || l2;
    return dummy.next;
}

// Test cases passing: 6/8`;

    case 'java':
      return `// Binary Tree Maximum Path Sum - Live Battle Code
public class Solution {
    private int maxSum = Integer.MIN_VALUE;
    
    public int maxPathSum(TreeNode root) {
        maxGain(root);
        return maxSum;
    }
    
    private int maxGain(TreeNode node) {
        if (node == null) return 0;
        
        // Max sum on the left and right sub-trees
        int leftGain = Math.max(maxGain(node.left), 0);
        int rightGain = Math.max(maxGain(node.right), 0);
        
        // Current path sum including the node
        int currentMaxPath = node.val + leftGain + rightGain;
        
        // Update global maximum
        maxSum = Math.max(maxSum, currentMaxPath);
        
        // Return max gain if continue path through node
        return node.val + Math.max(leftGain, rightGain);
    }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

// Test cases passing: 4/5`;

    case 'cpp':
      return `// Binary Tree Maximum Path Sum - Live Battle Code
#include <algorithm>
#include <climits>

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution {
private:
    int maxSum = INT_MIN;
    
    int maxGain(TreeNode* node) {
        if (!node) return 0;
        
        // Max sum on left and right subtrees
        int leftGain = std::max(maxGain(node->left), 0);
        int rightGain = std::max(maxGain(node->right), 0);
        
        // Current path sum including the node
        int currentMaxPath = node->val + leftGain + rightGain;
        
        // Update global maximum
        maxSum = std::max(maxSum, currentMaxPath);
        
        // Return max gain if continue path through node
        return node->val + std::max(leftGain, rightGain);
    }
    
public:
    int maxPathSum(TreeNode* root) {
        maxGain(root);
        return maxSum;
    }
};

// Test cases passing: 4/5`;

    default:
      return '// Live coding battle in progress...';
  }
}
