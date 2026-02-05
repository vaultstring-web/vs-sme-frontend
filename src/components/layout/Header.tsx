// src/components/layout/Header.tsx
'use client';

import { Bell, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

export const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-sm'
          : 'bg-background'
      }`}
    >
      {/* Left: Menu Toggle + Brand */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-foreground/70 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notification Bell */}
        <button
          className="p-2 rounded-xl text-foreground/60 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>

        <div className="hidden sm:block h-6 w-px bg-border dark:bg-border" />

        {/* Theme Toggle */}
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

        {/* User Profile */}
        <button
          className="ml-2 sm:ml-4 flex items-center gap-2 p-1.5 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <span className="text-white text-sm font-bold">U</span>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium">User Profile</p>
            <p className="text-xs text-foreground/60">Customer</p>
          </div>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full right-4 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg z-40 lg:hidden">
          <div className="px-3 py-2 space-y-1">
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
              My Profile
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
              Settings
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

const ThemeToggle = ({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) => {
  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-6 rounded-full bg-slate-200 dark:bg-slate-800 transition-colors flex items-center px-1 hover:bg-slate-300 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div
        className={`absolute w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${
          theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  );
};