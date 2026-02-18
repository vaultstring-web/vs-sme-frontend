'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  ArrowUpRight
} from 'lucide-react';

const menuGroups = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    ]
  },
  {
    label: 'Management',
    items: [
      { name: 'Applications', href: '/admin/applications', icon: FileText },
      { name: 'Users', href: '/admin/users', icon: Users },
    ]
  },
  {
    label: 'Account',
    items: [
      { name: 'Profile', href: '/admin/profile', icon: Settings },
    ]
  }
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { theme } = useTheme();

  return (
    <aside 
      className={`fixed lg:sticky top-0 inset-y-0 left-0 z-50 w-72 h-screen bg-card border-r border-border transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="flex flex-col h-full p-6">
        {/* Brand Area with Dynamic Logo */}
        <Link href="/admin/dashboard" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <img 
            src={theme === "dark" ? "/icons/vs1.svg" : "/icons/vs2.svg"} 
            alt="Logo" 
            className="h-20 w-auto md:h-25 lg:h-25"/>
        </Link>

        {/* Navigation Groups */}
        <nav className="flex-1 space-y-8 overflow-y-auto custom-scrollbar">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <h3 className="px-4 text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/50 mb-4">
                {group.label}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                        isActive 
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 shadow-sm' 
                          : 'text-foreground/70 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-foreground'
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
                            : 'text-foreground/50 group-hover:text-primary-500 dark:group-hover:text-primary-400 group-hover:scale-110'
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

        {/* Admin Badge */}
        <div className="mt-auto p-5 bg-slate-100 dark:bg-zinc-800/50 rounded-2xl border border-border">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <Settings className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                    <p className="text-xs font-medium text-foreground/60">Signed in as</p>
                    <p className="text-sm font-bold text-foreground">Administrator</p>
                </div>
            </div>
        </div>
      </div>
    </aside>
  );
}
