'use client';

import React from 'react';
import AnimatedNavbar from '@/components/AnimatedNavbar';
import { Footer } from '@/components/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  showNavbar = true, 
  showFooter = true 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {showNavbar && <AnimatedNavbar />}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
