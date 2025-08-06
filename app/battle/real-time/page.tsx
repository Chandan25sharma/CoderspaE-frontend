'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useBattleSocket } from '@/hooks/useBattleSocket';
import { CodeEditor } from '@/components/CodeEditor';
import { Timer } from '@/components/Timer';
import { Swords, User, Trophy, Clock, CheckCircle } from 'lucide-react';

export default function RealTimeBattlePage() {
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
      router.push('/auth/signin');
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
              <p className="text-white font-semibold">{session.user?.name}</p>
            </div>
            <div className="text-4xl text-purple-400">VS</div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mb-2">
                <User className="h-8 w-8 text-white" />
              </div>
              <p className="text-white font-semibold">{opponent?.name}</p>
            </div>
          </div>
          <p className="text-gray-400 mb-4">Challenge: {matchData.challenge.title}</p>
          <div className="text-purple-400">Battle starts in 3 seconds...</div>
        </div>
      </div>
    );
  }

  if (status === 'completed' && battleResult && session.user) {
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
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">Real-Time Battle Arena</h1>
              <div className="text-purple-400">
                Challenge: {matchData.challenge.title}
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <Timer timeLimit={matchData.timeLimit} />
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-400">You</div>
                <div className="font-semibold">{session.user?.name}</div>
              </div>
              
              <div className="text-purple-400 text-xl font-bold">VS</div>
              
              <div className="text-center">
                <div className="text-sm text-gray-400">Opponent</div>
                <div className="font-semibold">{opponent?.name}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-screen pt-16">
          {/* Problem Statement */}
          <div className="w-1/3 bg-gray-800 border-r border-gray-700 p-6 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Problem Statement</h2>
            <div className="prose prose-invert max-w-none">
              <h3 className="text-lg font-semibold mb-2">{matchData.challenge.title}</h3>
              <p className="text-gray-300 mb-4">{matchData.challenge.description}</p>
              
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Test Cases:</h4>
                {(matchData.challenge as any).testCases?.map((testCase: any, index: number) => (
                  <div key={index} className="bg-gray-900 p-3 rounded-lg mb-2">
                    <div className="mb-1">
                      <strong>Input:</strong> {testCase.input}
                    </div>
                    <div>
                      <strong>Output:</strong> {testCase.expectedOutput}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Constraints:</h4>
                <ul className="list-disc list-inside text-gray-300">
                  <li>Time Limit: 30 minutes</li>
                  <li>Memory Limit: 256 MB</li>
                  <li>All test cases must pass</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
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
