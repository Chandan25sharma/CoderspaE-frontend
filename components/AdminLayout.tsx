'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Swords,
  Brain,
  Shield,
  Trophy,
  Bell,
  Settings,
  Activity,
  BarChart,
  Plus,
  Search,
  Filter,
  Menu,
  X,
  Home,
  ChevronDown,
  LogOut
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeSection: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeSection }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }
    
    // Check if user is admin
    if (session.user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
  }, [session, status, router]);

  const menuItems = [
    {
      section: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      href: '/admin',
      subsections: []
    },
    {
      section: 'users',
      label: 'User Management',
      icon: Users,
      href: '/admin/users',
      subsections: [
        { label: 'All Users', href: '/admin/users' },
        { label: 'Banned Users', href: '/admin/users/banned' },
        { label: 'Moderators', href: '/admin/users/moderators' }
      ]
    },
    {
      section: 'battles',
      label: 'Battle Management',
      icon: Swords,
      href: '/admin/battles',
      subsections: [
        { label: 'Live Battles', href: '/admin/battles/live' },
        { label: 'Battle History', href: '/admin/battles/history' },
        { label: 'Reported Battles', href: '/admin/battles/reports' }
      ]
    },
    {
      section: 'challenges',
      label: 'Challenge Management',
      icon: Brain,
      href: '/admin/challenges',
      subsections: [
        { label: 'All Challenges', href: '/admin/challenges' },
        { label: 'Add Challenge', href: '/admin/challenges/add' },
        { label: 'AI Generator', href: '/admin/challenges/ai-generator' }
      ]
    },
    {
      section: 'leaderboard',
      label: 'Leaderboard Control',
      icon: Trophy,
      href: '/admin/leaderboard',
      subsections: []
    },
    {
      section: 'reports',
      label: 'Reports & Abuse',
      icon: Shield,
      href: '/admin/reports',
      subsections: []
    },
    {
      section: 'notifications',
      label: 'Notifications',
      icon: Bell,
      href: '/admin/notifications',
      subsections: [
        { label: 'Send Announcement', href: '/admin/notifications/send' },
        { label: 'Notification History', href: '/admin/notifications/history' }
      ]
    },
    {
      section: 'analytics',
      label: 'Analytics',
      icon: BarChart,
      href: '/admin/analytics',
      subsections: []
    },
    {
      section: 'activity',
      label: 'Activity Logs',
      icon: Activity,
      href: '/admin/activity',
      subsections: []
    },
    {
      section: 'settings',
      label: 'System Settings',
      icon: Settings,
      href: '/admin/settings',
      subsections: []
    }
  ];

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading admin panel...</div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-gray-800 border-r border-gray-700 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-red-400 mr-2" />
                <span className="text-xl font-bold text-white">Admin Panel</span>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <div key={item.section}>
              <button
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                  activeSection === item.section
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className={`h-5 w-5 ${isSidebarOpen ? 'mr-3' : ''}`} />
                {isSidebarOpen && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.subsections.length > 0 && (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </>
                )}
              </button>
              
              {/* Subsections */}
              {isSidebarOpen && item.subsections.length > 0 && activeSection === item.section && (
                <div className="ml-6 mt-2 space-y-1">
                  {item.subsections.map((sub, index) => (
                    <button
                      key={index}
                      onClick={() => router.push(sub.href)}
                      className="block w-full text-left px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-700">
          {isSidebarOpen ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {session.user.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-white text-sm font-medium">{session.user.name}</p>
                  <p className="text-gray-400 text-xs">Administrator</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/api/auth/signout')}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push('/api/auth/signout')}
              className="w-full p-2 text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white capitalize">
              {activeSection.replace('-', ' ')}
            </h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Filter className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
