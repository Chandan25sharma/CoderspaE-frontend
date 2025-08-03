'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useBattleSocket } from '@/hooks/useBattleSocket';
import { CodeEditor } from '@/components/CodeEditor';
import { Timer } from '@/components/Timer';
import { Swords, User, Trophy, Clock, CheckCircle } from 'lucide-react';

export default function BattlePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { 
    status, 
    matchData, 
    battleResult, 
    opponent, 
    submitCode, 
    joinQueue,
    error 
  } = useBattleSocket();
  
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  useEffect(() => {
    if (!session) {
      router.push('/');
      return;
    }

    // If no active battle, try to join queue
    if (status === 'connected') {
      joinQueue();
    }
  }, [session, status, joinQueue, router]);

  useEffect(() => {
    // Set starter code when challenge is loaded
    if (matchData?.challenge?.starterCode) {
      setCode(matchData.challenge.starterCode[language as keyof typeof matchData.challenge.starterCode] || '');
    }
  }, [matchData, language]);

  const handleSubmitCode = () => {
    if (code.trim() && matchData) {
      submitCode(code, language);
    }
  };

  if (!session) return null;

  if (status === 'disconnected') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">Connection Lost</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            Reconnect
          </button>
        </div>
      </div>
    );
  }

  if (status === 'waiting') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Searching for opponent...</h2>
          <p className="text-gray-400">Please wait while we find you a worthy challenger</p>
        </div>
      </div>
    );
  }

  if (status === 'matched' && matchData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Swords className="h-16 w-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Match Found!</h2>
          <div className="flex items-center justify-center space-x-8 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-2">
                <User className="h-8 w-8 text-white" />
              </div>
              <p className="text-white font-semibold">{session.user.name}</p>
            </div>
            <div className="text-4xl text-purple-400">VS</div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mb-2">
                <User className="h-8 w-8 text-white" />
              </div>
              <p className="text-white font-semibold">{opponent?.name}</p>
            </div>
          </div>
          <p className="text-gray-400">Challenge: {matchData.challenge.title}</p>
          <p className="text-gray-400">Get ready to battle!</p>
        </div>
      </div>
    );
  }

  if (status === 'completed' && battleResult) {
    const isWinner = battleResult.winner === session.user.id;
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto p-8">
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
            isWinner ? 'bg-green-600' : 'bg-red-600'
          }`}>
            {isWinner ? (
              <Trophy className="h-12 w-12 text-white" />
            ) : (
              <Clock className="h-12 w-12 text-white" />
            )}
          </div>
          
          <h2 className={`text-4xl font-bold mb-4 ${
            isWinner ? 'text-green-400' : 'text-red-400'
          }`}>
            {isWinner ? 'Victory!' : 'Defeat'}
          </h2>
          
          <p className="text-gray-400 mb-6">
            {isWinner ? 'Congratulations! You won the battle!' : 'Better luck next time!'}
          </p>

          <div className="bg-slate-800/50 p-6 rounded-lg border border-gray-600 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Battle Results</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Your Time</p>
                <p className="text-white font-semibold">
                  {battleResult.winner === session.user.id ? 
                    Math.round(battleResult.player1Time / 1000) : 
                    Math.round(battleResult.player2Time / 1000)
                  }s
                </p>
              </div>
              <div>
                <p className="text-gray-400">Opponent Time</p>
                <p className="text-white font-semibold">
                  {battleResult.winner === session.user.id ? 
                    Math.round(battleResult.player2Time / 1000) : 
                    Math.round(battleResult.player1Time / 1000)
                  }s
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Return to Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Battle Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'battle' && matchData) {
    return (
      <div className="min-h-screen">
        {/* Battle Header */}
        <div className="bg-slate-800/90 border-b border-purple-500/20 py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-bold text-white">
                {matchData.challenge.title}
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                matchData.challenge.difficulty === 'easy' ? 'bg-green-600 text-white' :
                matchData.challenge.difficulty === 'medium' ? 'bg-yellow-600 text-white' :
                'bg-red-600 text-white'
              }`}>
                {matchData.challenge.difficulty}
              </span>
            </div>
            
            <div className="flex items-center space-x-6">
              <Timer timeLimit={matchData.timeLimit} />
              <div className="text-right">
                <p className="text-sm text-gray-400">Opponent</p>
                <p className="text-white font-semibold">{opponent?.name}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-120px)]">
          {/* Problem Description */}
          <div className="w-1/3 bg-slate-900/50 border-r border-purple-500/20 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white mb-3">Problem</h2>
                <p className="text-gray-300 leading-relaxed">
                  {matchData.challenge.description}
                </p>
              </div>

              <div>
                <h3 className="text-md font-semibold text-white mb-3">Test Cases</h3>
                <div className="space-y-3">
                  {matchData.challenge.testCases.map((testCase, index) => (
                    <div key={index} className="bg-slate-800/50 p-3 rounded-lg">
                      <div className="text-sm">
                        <div className="mb-1">
                          <span className="text-gray-400">Input: </span>
                          <code className="text-green-400">{testCase.input}</code>
                        </div>
                        <div>
                          <span className="text-gray-400">Output: </span>
                          <code className="text-blue-400">{testCase.expectedOutput}</code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between bg-slate-800/30 px-4 py-2 border-b border-purple-500/20">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-700 text-white px-3 py-1 rounded border border-purple-500/30 focus:border-purple-400 focus:outline-none"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
              
              <button
                onClick={handleSubmitCode}
                disabled={!code.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Submit Solution</span>
              </button>
            </div>
            
            <div className="flex-1">
              <CodeEditor
                value={code}
                onChange={setCode}
                language={language}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-lg">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse text-purple-400 mb-4">Connecting...</div>
      </div>
    </div>
  );
}
