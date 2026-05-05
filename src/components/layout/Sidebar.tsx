// src/components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { 
  LayoutDashboard, 
  Wallet, 
  Users, 
  Settings, 
  ArrowUpRight, 
  ShieldCheck,
  CreditCard
} from 'lucide-react';

const menuGroups = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'My Applications', href: '/dashboard/applications', icon: CreditCard },
      { name: 'My Loans', href: '/dashboard/loans', icon: Wallet },
    ]
  },
  {
    label: 'Account',
    items: [
      { name: 'Profile', href: '/dashboard/profile', icon: Users },
    ]
  }
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}


export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { theme } = useTheme();

  return (
    <aside 
      className={`fixed lg:sticky top-0 inset-y-0 left-0 z-50 h-screen w-[85vw] max-w-72 border-r border-border bg-card transition-transform duration-300 ease-in-out sm:w-72 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="flex h-full flex-col p-4 sm:p-6">
        {/* Brand Area with Dynamic Logo */}
        <Link href="/" onClick={onClose} className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <img 
            src={theme === "dark" ? "/icons/vs1.svg" : "/icons/vs2.svg"} 
            alt="Logo" 
            className="h-14 w-auto sm:h-16 lg:h-20"/>
        </Link>

        {/* Navigation Groups */}
        <nav className="custom-scrollbar flex-1 space-y-8 overflow-y-auto overflow-x-hidden">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <h3 className="px-4 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-zinc-500 mb-4">
                {group.label}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className={`flex min-h-11 items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 group relative overflow-hidden ${
                        isActive 
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 shadow-sm' 
                          : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-zinc-100'
                      }`}
                    >
                      {/* Sleek hover effect overlay */}
                      {!isActive && (
                        <div className="absolute inset-0 bg-linear-to-r from-primary-50/0 via-primary-50/50 to-primary-50/0 dark:from-primary-900/0 dark:via-primary-900/20 dark:to-primary-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                      
                      <div className="flex items-center gap-3 relative z-10">
                        <item.icon className={`w-5 h-5 transition-all duration-200 ${
                          isActive 
                            ? 'text-primary-600 dark:text-primary-400' 
                            : 'text-slate-400 dark:text-zinc-500 group-hover:text-primary-500 dark:group-hover:text-primary-400 group-hover:scale-110'
                        }`} />
                        <span className="font-semibold text-sm tracking-tight">{item.name}</span>
                      </div>
                      {isActive && (
                        <div className="w-1 h-4 rounded-full bg-primary-600 dark:bg-primary-400 animate-in fade-in zoom-in duration-300 relative z-10" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Loan Card - Brighter Gradient */}
        <div className="mt-auto rounded-2xl bg-linear-to-br from-primary-500 via-primary-600 to-primary-700 p-4 text-white shadow-xl shadow-primary-500/30 transition-all duration-300 group relative overflow-hidden hover:shadow-2xl hover:shadow-primary-500/40 dark:from-primary-600 dark:via-primary-700 dark:to-primary-800 dark:shadow-primary-900/40 dark:hover:shadow-primary-900/50 sm:p-5">
          {/* Animated background blur */}
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:bg-white/30 group-hover:scale-125 transition-all duration-500" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-400/30 dark:bg-primary-800/30 rounded-full blur-3xl group-hover:scale-125 transition-all duration-500" />
          
          <div className="relative z-10">
            <p className="text-[10px] uppercase tracking-widest text-white/70 font-bold mb-1">Max Limit</p>
            <p className="text-2xl font-bold mb-4 tracking-tight drop-shadow-sm">MWK 5,000,000</p>
            <Link 
              href="/dashboard/applications"
              onClick={onClose}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-bold text-primary-700 shadow-lg transition-all duration-200 hover:bg-white/90 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 dark:bg-white/95 dark:text-primary-800 dark:hover:bg-white"
            >
              Boost Capital <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};