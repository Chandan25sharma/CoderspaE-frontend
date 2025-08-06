import Link from 'next/link';
import { Github, Twitter, Mail, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900/80 border-t border-purple-500/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              CoderspaE
            </h3>
            <p className="text-gray-400 text-sm">
              The ultimate international virtual code battle arena. Compete, learn, and master algorithms with developers worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/battle" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Battle Arena
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tournament" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Tournaments
                </Link>
              </li>
              <li>
                <Link href="/challenges" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Practice Challenges
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Help & Support
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-purple-400 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Security Policy
                </Link>
              </li>
              <li>
                <Link href="/data-protection" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Data Protection
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold">Connect</h4>
            <div className="flex space-x-3">
              <a
                href="https://github.com/coderspae"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/coderspae"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@coderspae.com"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 CoderspaE. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-400" />
            <span>for developers worldwide</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
