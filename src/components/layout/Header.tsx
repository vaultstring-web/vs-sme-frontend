// src/components/layout/Header.tsx
'use client';

import { Menu, Bell, Search, User, Sun, Moon, X } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  onToggleDarkMode: () => void;
  darkMode: boolean;
  sidebarOpen: boolean;
  user?: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
}

export default function Header({ 
  onMenuClick, 
  onToggleDarkMode,
  darkMode,
  sidebarOpen,
  user 
}: HeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const userName = user?.name || 'Guest User';
  const userRole = user?.role || 'Visitor';

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-black/90 border-b border-gray-200 dark:border-gray-800 backdrop-blur-sm">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Menu button - Always shows hamburger, sidebar has its own X */}
          <button
            onClick={onMenuClick}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">SME Portal</h1>
            <p className="text-xs text-lime-600 dark:text-lime-500 font-medium">Secure Lending</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Dark/Light Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            aria-label="Toggle theme"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-full px-4 py-2 w-64">
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search loans..."
              className="bg-transparent border-none focus:outline-none text-sm text-gray-900 dark:text-white w-full placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-lime-500 rounded-full" />
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-300 dark:border-gray-800">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[120px]">
                {userName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                {userRole}
              </p>
            </div>
            <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {getInitials(userName)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}