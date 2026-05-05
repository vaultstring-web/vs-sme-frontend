// src/components/layout/Header.tsx
'use client';

import { Menu } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { AuthContext } from '@/context/AuthContext';
import NotificationBadge from '@/components/NotificationBadge';
import NotificationCenter from '@/components/NotificationCenter';

export const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useContext(AuthContext)!;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdmin = user && ['SUPER_ADMIN', 'LOAN_MANAGER', 'LOAN_OFFICER', 'ACCOUNTANT', 'AUDITOR'].includes(user.role);

  return (
    <>
      <header
      className={`relative sticky top-0 z-30 flex h-16 items-center justify-between px-4 transition-all duration-300 sm:px-6 ${
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
        <NotificationBadge onClick={() => setNotificationsOpen(true)} />

        <div className="hidden sm:block h-6 w-px bg-border dark:bg-border" />

        {/* Theme Toggle */}
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

        {/* User Profile */}
        <button
          className="ml-2 sm:ml-4 flex items-center gap-2 p-1.5 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {user?.fullName?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium">{user?.fullName || 'Guest'}</p>
            <p className="text-xs text-foreground/60">{user?.role || 'Customer'}</p>
          </div>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="absolute right-2 left-2 top-full z-40 mt-2 w-auto max-w-[calc(100vw-1rem)] rounded-xl border border-border bg-card shadow-lg sm:left-auto sm:right-4 sm:w-56">
          <div className="space-y-1 px-3 py-2">
            <button className="min-h-10 w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-primary-50 dark:hover:bg-primary-900/20">
              My Profile
            </button>
            <button className="min-h-10 w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-primary-50 dark:hover:bg-primary-900/20">
              Settings
            </button>
            <button 
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
              className="min-h-10 w-full rounded-lg px-3 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Logout
            </button>
          </div>
        </div>
      )}
      </header>
      <NotificationCenter 
        open={isNotificationsOpen} 
        onClose={() => setNotificationsOpen(false)} 
      />
    </>
  );
};

const ThemeToggle = ({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) => {
  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-10 w-12 items-center rounded-full bg-slate-200 px-1 transition-colors hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-800 dark:hover:bg-slate-700 sm:h-6"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div
        className={`absolute h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${
          theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  );
};