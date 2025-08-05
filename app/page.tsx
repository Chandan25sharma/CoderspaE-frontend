'use client';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { Swords, Trophy, Users, Code, Globe, Zap, ArrowRight, Play } from 'lucide-react';
import GameLayout from '../components/GameLayout';

export default function Home() {
  const { data: session } = useSession();

  return (
    <GameLayout>
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Swords className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                CoderspaE
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              The ultimate international virtual code battle arena. Compete in real-time coding challenges 
              against developers worldwide and climb the global leaderboard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Enter Battle Arena
                </Link>
                <Link
                  href="/leaderboard"
                  className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white font-semibold rounded-lg transition-colors"
                >
                  <Trophy className="h-5 w-5 mr-2" />
                  View Leaderboard
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => signIn()}
                  className="inline-flex items-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Start Battling Now
                </button>
                <Link
                  href="/leaderboard"
                  className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white font-semibold rounded-lg transition-colors"
                >
                  <Trophy className="h-5 w-5 mr-2" />
                  View Leaderboard
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">10,000+</div>
              <div className="text-gray-400">Active Coders</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400 mb-2">50,000+</div>
              <div className="text-gray-400">Battles Fought</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">25+</div>
              <div className="text-gray-400">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Why Choose CoderspaE?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Experience the most advanced real-time coding battle platform with features designed for serious developers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-900/50 p-6 rounded-lg border border-purple-500/20">
              <Zap className="h-12 w-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Real-Time Battles</h3>
              <p className="text-gray-400">
                Compete in live coding challenges with instant feedback and real-time opponent tracking.
              </p>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-lg border border-purple-500/20">
              <Globe className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Global Community</h3>
              <p className="text-gray-400">
                Connect with developers from around the world in our international arena.
              </p>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-lg border border-purple-500/20">
              <Code className="h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Multiple Languages</h3>
              <p className="text-gray-400">
                Code in JavaScript, Python, Java, C++, and more with our advanced code editor.
              </p>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-lg border border-purple-500/20">
              <Trophy className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Competitive Rankings</h3>
              <p className="text-gray-400">
                Climb the global leaderboard and earn recognition for your coding skills.
              </p>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-lg border border-purple-500/20">
              <Users className="h-12 w-12 text-pink-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Team Tournaments</h3>
              <p className="text-gray-400">
                Participate in team battles and special tournament events for extra rewards.
              </p>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-lg border border-purple-500/20">
              <Swords className="h-12 w-12 text-red-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Skill Progression</h3>
              <p className="text-gray-400">
                Track your improvement with detailed analytics and personalized challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Prove Your Coding Skills?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of developers in the most exciting coding competition platform.
          </p>
          {!session && (
            <button
              onClick={() => signIn()}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              <ArrowRight className="h-6 w-6 mr-2" />
              Join the Battle Now
            </button>
          )}
        </div>
      </section>
      </div>
    </GameLayout>
  );
}
