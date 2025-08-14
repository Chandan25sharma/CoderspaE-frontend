'use client';

import { motion } from 'framer-motion';
import { Eye, Users, Clock } from 'lucide-react';

interface OngoingMatch {
  id: string;
  player1: string;
  player2: string;
  problem: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: string;
  spectators: number;
  status: 'In Progress' | 'Starting Soon';
}

interface OngoingMatchesProps {
  matches: OngoingMatch[];
  onJoinAsSpectator: (matchId: string) => void;
}

const OngoingMatches: React.FC<OngoingMatchesProps> = ({ matches, onJoinAsSpectator }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <motion.div
      className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
          <Eye className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white">Ongoing Matches</h2>
        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
          {matches.length} Live
        </span>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {matches.map((match, index) => (
          <motion.div
            key={match.id}
            className="bg-gray-700/50 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium text-sm">
                    {match.player1} vs {match.player2}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(match.difficulty)}`}>
                  {match.difficulty}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Clock className="w-3 h-3" />
                {match.duration}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-gray-300 text-sm">{match.problem}</p>
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <Eye className="w-3 h-3" />
                  <span>{match.spectators} watching</span>
                  <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                  <span className={match.status === 'In Progress' ? 'text-green-400' : 'text-yellow-400'}>
                    {match.status}
                  </span>
                </div>
              </div>
              
              <motion.button
                onClick={() => onJoinAsSpectator(match.id)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Spectate
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default OngoingMatches;
