'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Github, Mail, ArrowRight, Swords, User } from 'lucide-react';

export default function SignInPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCredentialsAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        name: isSignUp ? name : '',
        isSignUp: isSignUp.toString(),
        callbackUrl: '/dashboard',
        redirect: false,
      });

      if (result?.error) {
        alert(result.error);
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch {
      alert('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <Swords className="h-12 w-12 text-purple-400 mr-3" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              CoderspaE
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isSignUp ? 'Join the Battle Arena' : 'Welcome Back'}
          </h2>
          <p className="text-gray-400">
            {isSignUp 
              ? 'Create your account to compete with developers worldwide' 
              : 'Sign in to compete with developers worldwide'
            }
          </p>
        </div>

        {/* Toggle Sign In / Sign Up */}
        <div className="flex bg-slate-800/50 rounded-lg p-1">
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              !isSignUp 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              isSignUp 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Auth Form */}
        <div className="space-y-4">
          {/* Email/Password Form */}
          <form onSubmit={handleCredentialsAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="sr-only">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    required={isSignUp}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-purple-500/30 rounded-lg bg-slate-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Full Name"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-purple-500/30 rounded-lg bg-slate-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Email address"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-white font-medium rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900 text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* OAuth Providers */}
          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="group relative w-full flex justify-center py-3 px-4 border border-purple-500/30 text-white font-medium rounded-lg bg-slate-800/50 hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-4">
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </span>
            Continue with Google
          </button>

          {/* GitHub Sign In */}
          <button
            onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
            className="group relative w-full flex justify-center py-3 px-4 border border-purple-500/30 text-white font-medium rounded-lg bg-slate-800/50 hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-4">
              <Github className="h-5 w-5 text-white" />
            </span>
            Continue with GitHub
          </button>
        </div>

        {/* Features */}
        <div className="mt-8">
          <div className="text-center text-sm text-gray-400 mb-4">
            Join thousands of developers and:
          </div>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex items-center">
              <ArrowRight className="h-4 w-4 text-purple-400 mr-2" />
              <span>Compete in real-time coding battles</span>
            </div>
            <div className="flex items-center">
              <ArrowRight className="h-4 w-4 text-purple-400 mr-2" />
              <span>Climb the global leaderboard</span>
            </div>
            <div className="flex items-center">
              <ArrowRight className="h-4 w-4 text-purple-400 mr-2" />
              <span>Practice with coding challenges</span>
            </div>
            <div className="flex items-center">
              <ArrowRight className="h-4 w-4 text-purple-400 mr-2" />
              <span>Connect with developers worldwide</span>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-purple-400 hover:text-purple-300">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-purple-400 hover:text-purple-300">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
