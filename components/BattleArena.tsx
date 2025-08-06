import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useBattleSystem } from '@/hooks/useBattleSystem';

const BattleArena: React.FC = () => {
  const { data: session } = useSession();
  const {
    isInQueue,
    isInBattle,
    challenge,
    opponent,
    timeRemaining,
    code,
    language,
    testResults,
    error,
    connectionStatus,
    queuePosition,
    joinQueue,
    leaveQueue,
    submitCode,
    updateCode,
    updateLanguage,
    reconnect
  } = useBattleSystem();

  const [output, setOutput] = useState<string>('');

  const handleRunCode = async () => {
    if (!code.trim() || !challenge) return;
    
    setOutput('Running code...\n');
    
    try {
      const response = await fetch('/api/code/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          challengeId: challenge.id,
          testCases: challenge.testCases
        })
      });

      const data = await response.json();
      
      if (data.success && data.execution) {
        const { results, totalTime, summary } = data.execution;
        
        let outputText = `Execution completed in ${totalTime}ms\n\n`;
        outputText += `Test Results: ${summary.passed}/${summary.total} passed\n\n`;
        
        results.forEach((result: { 
          passed: boolean; 
          input: string; 
          expectedOutput: string; 
          actualOutput: string; 
          executionTime: number; 
        }, index: number) => {
          outputText += `Test Case ${index + 1}: ${result.passed ? '✅ PASS' : '❌ FAIL'}\n`;
          outputText += `Input: ${result.input}\n`;
          outputText += `Expected: ${result.expectedOutput}\n`;
          outputText += `Got: ${result.actualOutput}\n`;
          outputText += `Time: ${result.executionTime}ms\n\n`;
        });
        
        setOutput(outputText);
      } else {
        setOutput(`Error: ${data.error || 'Code execution failed'}`);
      }
    } catch (error) {
      setOutput(`Network error: ${error}\nPlease check your connection and try again.`);
    }
  };

  const handleSubmitCode = () => {
    submitCode(code);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Battle Arena</h1>
          <p className="text-gray-400 mb-6">Please log in to join battles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Battle Arena</h1>
            <div className={`px-3 py-1 rounded-full text-sm ${
              connectionStatus === 'connected' ? 'bg-green-600' : 
              connectionStatus === 'fallback' ? 'bg-yellow-600' : 
              'bg-red-600'
            }`}>
              {connectionStatus === 'connected' ? 'Real-time' : 
               connectionStatus === 'fallback' ? 'Fallback Mode' : 
               'Disconnected'}
            </div>
          </div>
          
          {isInBattle && (
            <div className="flex items-center space-x-4">
              <div className="text-lg font-mono">
                ⏱️ {formatTime(timeRemaining)}
              </div>
              {opponent && (
                <div className="text-sm text-gray-400">
                  vs {opponent}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-600 text-white px-6 py-3">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            {connectionStatus === 'disconnected' && (
              <button
                onClick={reconnect}
                className="px-3 py-1 bg-red-700 rounded hover:bg-red-800"
              >
                Reconnect
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex h-screen">
        {/* Queue/Waiting Area */}
        {!isInBattle && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              {!isInQueue ? (
                <>
                  <h2 className="text-3xl font-bold mb-4">Ready to Battle?</h2>
                  <p className="text-gray-400 mb-8">
                    Join the queue to be matched with another coder for a real-time coding battle!
                  </p>
                  <button
                    onClick={joinQueue}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition-colors"
                  >
                    Join Battle Queue
                  </button>
                </>
              ) : (
                <>
                  <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
                  <h2 className="text-2xl font-bold mb-4">Finding Opponent...</h2>
                  {queuePosition && (
                    <p className="text-gray-400 mb-4">
                      Position in queue: {queuePosition}
                    </p>
                  )}
                  <button
                    onClick={leaveQueue}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
                  >
                    Leave Queue
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Battle Interface */}
        {isInBattle && challenge && (
          <>
            {/* Problem Description */}
            <div className="w-1/3 bg-gray-800 border-r border-gray-700 p-6 overflow-y-auto">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">{challenge.title}</h2>
                <div className={`inline-block px-2 py-1 rounded text-sm ${
                  challenge.difficulty === 'easy' ? 'bg-green-600' :
                  challenge.difficulty === 'medium' ? 'bg-yellow-600' :
                  'bg-red-600'
                }`}>
                  {challenge.difficulty}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-300">{challenge.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Test Cases</h3>
                <div className="space-y-3">
                  {challenge.testCases.map((testCase, index) => (
                    <div key={index} className="bg-gray-700 p-3 rounded">
                      <div className="text-sm text-gray-400 mb-1">Input:</div>
                      <div className="font-mono text-sm mb-2">{testCase.input}</div>
                      <div className="text-sm text-gray-400 mb-1">Expected Output:</div>
                      <div className="font-mono text-sm">{testCase.expectedOutput}</div>
                    </div>
                  ))}
                </div>
              </div>

              {testResults.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Test Results</h3>
                  <div className="space-y-2">
                    {testResults.map((result, index) => (
                      <div key={index} className={`p-2 rounded ${
                        result.passed ? 'bg-green-600' : 'bg-red-600'
                      }`}>
                        Test {index + 1}: {result.passed ? '✅ Passed' : '❌ Failed'}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Code Editor */}
            <div className="flex-1 flex flex-col">
              {/* Language Selector */}
              <div className="bg-gray-800 border-b border-gray-700 px-4 py-2">
                <select
                  value={language}
                  onChange={(e) => updateLanguage(e.target.value)}
                  className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                </select>
              </div>

              {/* Code Editor Area */}
              <div className="flex-1 flex flex-col">
                <textarea
                  value={code}
                  onChange={(e) => updateCode(e.target.value)}
                  className="flex-1 bg-gray-900 text-white font-mono text-sm p-4 border-none outline-none resize-none"
                  placeholder="Write your code here..."
                  style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
                />

                {/* Controls */}
                <div className="bg-gray-800 border-t border-gray-700 px-4 py-3 flex items-center space-x-3">
                  <button
                    onClick={handleRunCode}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
                  >
                    Run Code
                  </button>
                  <button
                    onClick={handleSubmitCode}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                  >
                    Submit Solution
                  </button>
                </div>
              </div>
            </div>

            {/* Output Panel */}
            <div className="w-1/3 bg-gray-800 border-l border-gray-700 flex flex-col">
              <div className="bg-gray-700 px-4 py-2 border-b border-gray-600">
                <h3 className="font-semibold">Output</h3>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {output || 'Run your code to see output here...'}
                </pre>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BattleArena;
