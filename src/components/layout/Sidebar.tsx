// src/components/layout/Sidebar.tsx
'use client';

import { 
  Home, CreditCard, Wallet, BarChart3, 
  Building, Users, Settings, HelpCircle, X 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userRole?: string;
}

export default function Sidebar({ 
  isOpen, 
  onClose, 
  userName = 'Guest User',
  userRole = 'Visitor'
}: SidebarProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Loan Applications', href: '/loan-applications', icon: CreditCard },
    { name: 'Loan Products', href: '/loan-products', icon: Wallet },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Business Profile', href: '/business-profile', icon: Building },
    { name: 'Team Members', href: '/team-members', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Help & Support', href: '/help-support', icon: HelpCircle },
  ];

  // Check if dark mode is enabled
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Observe changes to dark mode
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  // Extract initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="pt-8 px-6 pb-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-0">
          <div className="relative w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden">
            {/* Different logos for light/dark mode */}
            {isDarkMode ? (
              // Dark mode logo (white/light logo)
              <Image
                src="/vs4.png" // Your dark mode logo - should be white/light
                alt="VaultString Logo"
                width={150}
                height={150}
                className="object-contain p-1" // invert makes dark logo light
                priority
              />
            ) : (
              // Light mode logo (dark/colored logo)
              <Image
                src="/vs3.png" // Your light mode logo - should be dark/colored
                alt="VaultString Logo"
                width={150}
                height={150}
                className="object-contain p-1"
                priority
              />
            )}
            
            
          </div>
          {/* Times New Roman font */}
          <span className="text-xl font-black text-gray-900 dark:text-white font-serif">
            VaultString
          </span>
        </div>
        
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:text-lime-600 dark:hover:text-lime-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={onClose}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* User Profile - Uses passed userName and userRole */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-900 dark:text-white">
              {getInitials(userName)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {userName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {userRole}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}