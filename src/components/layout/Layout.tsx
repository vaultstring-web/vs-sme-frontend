// src/components/layout/Layout.tsx
'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
}

export default function Layout({ children, user }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [sidebarOpen]);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
        {/* Mobile Overlay - Only on mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/80 z-40 lg:hidden"
            onClick={closeSidebar}
          />
        )}
        
        {/* Sidebar - Opens OVER content on both mobile and desktop */}
        <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:z-40`}>
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={closeSidebar}
            userName={user?.name || 'Guest User'}
            userRole={user?.role || 'Visitor'}
          />
        </div>

        {/* Main Content - STAYS IN PLACE, doesn't move */}
        <div className="w-full min-h-screen">
          <Header 
            onMenuClick={toggleSidebar}
            onToggleDarkMode={toggleDarkMode}
            darkMode={darkMode}
            user={user}
            sidebarOpen={sidebarOpen}
          />
          
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
          
          
        </div>
      </div>
    </div>
  );
}