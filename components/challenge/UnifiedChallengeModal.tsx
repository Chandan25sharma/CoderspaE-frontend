'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  X, 
  Send, 
  Clock, 
  Trophy,
  ChevronRight,
  Zap,
  Star
} from 'lucide-react';
import GameModeSelector from '../battle/GameModeSelector';
import { GameModeType, ChallengeType } from '@/types/gameMode';
import { GAME_MODES } from '@/lib/gameModes';
import { useSocket } from '@/hooks/useSocket';

interface UnifiedChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser?: {
    _id: string;
    username: string;
    name: string;
    avatar?: string;
    rating?: number;
  };
  targetTeam?: {
    _id: string;
    name: string;
    avatar?: string;
    rating?: number;
    members: any[];
  };
  userTeam?: {
    _id: string;
    name: string;
    members: any[];
  };
}

const UnifiedChallengeModal: React.FC<UnifiedChallengeModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  targetTeam,
  userTeam
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { sendChallenge, isConnected } = useSocket();
  
  const [selectedMode, setSelectedMode] = useState<GameModeType>('quick-dual');
  const [selectedChallengeType, setSelectedChallengeType] = useState<ChallengeType>('1v1-direct');
  const [selectedProblem, setSelectedProblem] = useState<string>('');
  const [customSettings, setCustomSettings] = useState({
    timeLimit: 30,
    isRanked: true,
    allowSpectators: true,
    maxSpectators: 10
  });
  const [step, setStep] = useState<'mode' | 'problem' | 'settings' | 'confirm'>('mode');
  const [loading, setLoading] = useState(false);
  const [problems, setProblems] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      setStep('mode');
      setSelectedMode('quick-dual');
      setSelectedChallengeType(targetTeam ? 'team-vs-team' : '1v1-direct');
      fetchProblems();
    }
  }, [isOpen, targetTeam]);

  const fetchProblems = async () => {
    try {
      const response = await fetch('/api/problems');
      const data = await response.json();
      if (data.success) {
        setProblems(data.problems || []);
        if (data.problems && data.problems.length > 0) {
          setSelectedProblem(data.problems[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  const handleModeSelect = (mode: GameModeType, challengeType: ChallengeType) => {
    setSelectedMode(mode);
    setSelectedChallengeType(challengeType);
    
    // Update time limit based on mode
    const modeConfig = GAME_MODES[mode];
    setCustomSettings(prev => ({
      ...prev,
      timeLimit: modeConfig.rules.timeLimit
    }));
    
    setStep('problem');
  };

  const handleSendChallenge = async () => {
    if (!session?.user?.id) {
      router.push('/auth/signin');
      return;
    }

    if (!isConnected) {
      alert('Not connected to server. Please check your connection.');
      return;
    }

    setLoading(true);

    try {
      // Send via Socket.IO for real-time
      sendChallenge(
        targetTeam ? targetTeam._id : targetUser?._id || '',
        selectedProblem ? [selectedProblem] : [],
        customSettings.timeLimit
      );
      
      onClose();
      // Show success notification
      alert(`Challenge sent successfully to ${targetTeam ? targetTeam.name : targetUser?.username}!`);
    } catch (error) {
      console.error('Error sending challenge:', error);
      alert('Error sending challenge. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'mode':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">Choose Game Mode</h3>
              <p className="text-gray-400">
                Select a game mode to challenge {targetTeam ? targetTeam.name : targetUser?.username}
              </p>
            </div>
            
            <GameModeSelector
              onModeSelect={handleModeSelect}
              selectedMode={selectedMode}
              userTeam={userTeam}
              className="max-h-96 overflow-y-auto"
            />
          </div>
        );

      case 'problem':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Select Problem</h3>
                <p className="text-gray-400">Choose a coding challenge</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full">
                <div className="text-2xl">{GAME_MODES[selectedMode].icon}</div>
                <span className="text-blue-300 font-medium">{GAME_MODES[selectedMode].name}</span>
              </div>
            </div>

            <div className="grid gap-3 max-h-80 overflow-y-auto">
              {problems.map((problem) => (
                <motion.div
                  key={problem._id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedProblem === problem._id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedProblem(problem._id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{problem.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300' :
                        problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {problem.difficulty}
                      </span>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-3 h-3" />
                        <span className="text-xs">{problem.rating || 1200}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {problem.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Match Settings</h3>
                <p className="text-gray-400">Customize your battle parameters</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Time Limit (minutes)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="5"
                    max="120"
                    value={customSettings.timeLimit}
                    onChange={(e) => setCustomSettings(prev => ({
                      ...prev,
                      timeLimit: parseInt(e.target.value)
                    }))}
                    className="flex-1 accent-blue-500"
                  />
                  <span className="text-white font-medium min-w-[3rem]">
                    {customSettings.timeLimit}min
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">Ranked Match</h4>
                  <p className="text-gray-400 text-sm">Affects your rating</p>
                </div>
                <button
                  onClick={() => setCustomSettings(prev => ({
                    ...prev,
                    isRanked: !prev.isRanked
                  }))}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    customSettings.isRanked ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    customSettings.isRanked ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">Allow Spectators</h4>
                  <p className="text-gray-400 text-sm">Others can watch your match</p>
                </div>
                <button
                  onClick={() => setCustomSettings(prev => ({
                    ...prev,
                    allowSpectators: !prev.allowSpectators
                  }))}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    customSettings.allowSpectators ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    customSettings.allowSpectators ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {customSettings.allowSpectators && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Max Spectators
                  </label>
                  <select
                    value={customSettings.maxSpectators}
                    onChange={(e) => setCustomSettings(prev => ({
                      ...prev,
                      maxSpectators: parseInt(e.target.value)
                    }))}
                    className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  >
                    <option value={5}>5 spectators</option>
                    <option value={10}>10 spectators</option>
                    <option value={25}>25 spectators</option>
                    <option value={50}>50 spectators</option>
                    <option value={0}>Unlimited</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        );

      case 'confirm':
        const selectedProblemData = problems.find(p => p._id === selectedProblem);
        const modeConfig = GAME_MODES[selectedMode];
        
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">Confirm Challenge</h3>
              <p className="text-gray-400">
                Review your challenge details before sending
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Opponent:</span>
                <div className="flex items-center gap-2">
                  {(targetTeam || targetUser)?.avatar && (
                    <img
                      src={(targetTeam || targetUser)?.avatar}
                      alt="Avatar"
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span className="text-white font-medium">
                    {targetTeam ? targetTeam.name : targetUser?.username}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">Game Mode:</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{modeConfig.icon}</span>
                  <span className="text-white font-medium">{modeConfig.name}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">Problem:</span>
                <span className="text-white font-medium">
                  {selectedProblemData?.title || 'Random'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">Time Limit:</span>
                <div className="flex items-center gap-1 text-white">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">{customSettings.timeLimit} minutes</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">Match Type:</span>
                <div className="flex items-center gap-2">
                  {customSettings.isRanked ? (
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Trophy className="w-4 h-4" />
                      <span className="font-medium">Ranked</span>
                    </div>
                  ) : (
                    <span className="text-gray-300">Casual</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderStepButtons = () => {
    switch (step) {
      case 'mode':
        return (
          <div className="flex justify-end">
            <button
              onClick={() => setStep('problem')}
              disabled={!selectedMode}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        );

      case 'problem':
        return (
          <div className="flex justify-between">
            <button
              onClick={() => setStep('mode')}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep('settings')}
              disabled={!selectedProblem}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        );

      case 'settings':
        return (
          <div className="flex justify-between">
            <button
              onClick={() => setStep('problem')}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep('confirm')}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Review
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        );

      case 'confirm':
        return (
          <div className="flex justify-between">
            <button
              onClick={() => setStep('settings')}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSendChallenge}
              disabled={loading || !isConnected}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Send Challenge
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gray-900 rounded-xl shadow-2xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-blue-400" />
                <div>
                  <h2 className="text-xl font-bold text-white">Send Challenge</h2>
                  <p className="text-gray-400 text-sm">
                    Step {
                      step === 'mode' ? 1 :
                      step === 'problem' ? 2 :
                      step === 'settings' ? 3 : 4
                    } of 4
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-2">
              <div className="w-full bg-gray-700 rounded-full h-1">
                <div
                  className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      step === 'mode' ? '25%' :
                      step === 'problem' ? '50%' :
                      step === 'settings' ? '75%' : '100%'
                    }`
                  }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {renderStepContent()}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-700">
              {renderStepButtons()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UnifiedChallengeModal;
