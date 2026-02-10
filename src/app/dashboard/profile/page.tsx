// src/app/dashboard/profile/page.tsx
"use client";

import { PersonalInfo } from '@/components/dashboard/profile/PersonalInfo';
import { AccountStatus } from '@/components/dashboard/profile/AccountStatus';
import { DocumentVerification } from '@/components/dashboard/profile/DocumentVerification';
import { SecuritySettings } from '@/components/dashboard/profile/SecuritySettings';

export default function ProfilePage() {
  return (
    <div className="min-h-screen p-4 md:p-10 max-w-(--breakpoint-xl) mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Cleaner Header - Removed the badge from here since it's now in AccountStatus */}
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Profile Settings</h1>
        <p className="text-slate-500 mt-2 text-lg">
          View and manage your account information and security.
        </p>
      </header>

      {/* Changed to a vertical stack for better readability, or a 2:1 ratio grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Left Column: Core Info & Documents (8/12 columns) */}
        <div className="xl:col-span-8 space-y-10">
          <PersonalInfo />
          
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-foreground px-2">Verification & Activity</h3>
            <DocumentVerification />
          </div>
        </div>

        {/* Right Column: Status & Security (4/12 columns) */}
        <div className="xl:col-span-4 space-y-10">
          <AccountStatus />
          <SecuritySettings />
          
          {/* Support Widget - Enhanced Contrast */}
          {/* <div className="p-8 rounded-3xl bg-blue-600 text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="font-bold text-xl mb-3">Need Assistance?</h4>
              <p className="text-blue-100/90 text-sm mb-6 leading-relaxed">
                Our support team is available 24/7 for help with loan applications.
              </p>
              <button className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-md">
                Contact Support
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500" />
          </div> */}
        </div>
        
      </div>
    </div>
  );
}