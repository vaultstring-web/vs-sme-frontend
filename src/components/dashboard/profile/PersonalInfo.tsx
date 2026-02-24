// src/components/dashboard/profile/PersonalInfo.tsx
"use client";

import React, { useContext, useEffect, useState } from 'react';
import { User as UserIcon, Mail, Phone, MapPin, CreditCard, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { AuthContext } from '@/context/AuthContext';
import apiClient from '@/lib/apiClient';


interface ExtendedUserProfile {
  id: string;
  email: string;
  fullName: string;
  nationalIdOrPassport: string;
  primaryPhone: string;
  secondaryPhone?: string;
  physicalAddress: string;
  postalAddress?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function PersonalInfo() {
  const auth = useContext(AuthContext);
  const [profileData, setProfileData] = useState<ExtendedUserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Fetch extended user profile data
  const fetchUserProfile = async () => {
    if (!auth?.user?.id) return;

    setIsLoadingProfile(true);
    setProfileError(null);

    try {
      const response = await apiClient.get('/auth/users/me');
      setProfileData(response.data.user);
    } catch (error: any) {
      console.error('Failed to fetch user profile:', error);
      setProfileError(error.response?.data?.message || 'Failed to load profile data');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Fetch profile data on component mount
  useEffect(() => {
    if (auth?.user && !auth.isLoading) {
      fetchUserProfile();
    }
  }, [auth?.user, auth?.isLoading]);

  // Handle initial auth loading state
  if (auth?.isLoading) {
    return (
      <section className="bento-card p-8 bg-card flex items-center justify-center min-h-100">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto" />
          <p className="text-sm text-slate-500">Loading authentication...</p>
        </div>
      </section>
    );
  }

  // Handle unauthenticated state
  if (!auth?.user) {
    return (
      <section className="bento-card p-8 bg-card flex items-center justify-center min-h-100">
        <div className="text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
          <p className="text-sm text-slate-500">Please log in to view your profile</p>
        </div>
      </section>
    );
  }

  const user = auth.user;
  const profile = profileData || null;

  return (
    <section className="bento-card p-8 bg-card relative overflow-hidden">
      {/* Decorative subtle gradient top left */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl" />

      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-100 dark:bg-white/5 border border-border rounded-xl shadow-sm">
            <UserIcon className="w-6 h-6 text-slate-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Personal Information</h2>
            <p className="text-xs text-slate-400 mt-0.5 uppercase tracking-widest font-medium">Verified Identity Details</p>
          </div>
        </div>

        {/* Refresh button */}
        <button
          onClick={fetchUserProfile}
          disabled={isLoadingProfile}
          className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refresh profile data"
        >
          <RefreshCw className={`w-4 h-4 text-slate-500 ${isLoadingProfile ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Error state */}
      {profileError && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900 dark:text-red-200">Failed to load profile</p>
            <p className="text-xs text-red-700 dark:text-red-300 mt-1">{profileError}</p>
          </div>
          <button
            onClick={fetchUserProfile}
            className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading overlay */}
      {isLoadingProfile && !profile && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <Loader2 className="w-6 h-6 text-primary-500 animate-spin mx-auto" />
            <p className="text-sm text-slate-500">Loading profile details...</p>
          </div>
        </div>
      )}

      {/* Profile fields */}
      {(!isLoadingProfile || profile) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          <InfoField 
            label="Full Name" 
            value={profile?.fullName || user.fullName || "Not Provided"} 
            icon={<UserIcon className="w-3.5 h-3.5" />}
            isLoading={isLoadingProfile}
          />

          <InfoField 
            label="Email Address" 
            value={profile?.email || user.email || "Not Provided"} 
            icon={<Mail className="w-3.5 h-3.5" />}
            isLoading={isLoadingProfile}
          />

          <InfoField 
            label="Primary Phone" 
            value={profile?.primaryPhone || "Not Provided"} 
            icon={<Phone className="w-3.5 h-3.5" />}
            isLoading={isLoadingProfile}
          />

          <InfoField 
            label="National ID / Passport" 
            value={profile?.nationalIdOrPassport || "Not Provided"} 
            icon={<CreditCard className="w-3.5 h-3.5" />}
            isLoading={isLoadingProfile}
          />

          {profile?.secondaryPhone && (
            <InfoField 
              label="Secondary Phone" 
              value={profile.secondaryPhone} 
              icon={<Phone className="w-3.5 h-3.5" />}
              isLoading={isLoadingProfile}
            />
          )}

          <div className={profile?.secondaryPhone ? "" : "md:col-span-2"}>
            <InfoField 
              label="Physical Address" 
              value={profile?.physicalAddress || "Not Provided"} 
              icon={<MapPin className="w-3.5 h-3.5" />}
              isLoading={isLoadingProfile}
            />
          </div>

          {profile?.postalAddress && (
            <div className="md:col-span-2">
              <InfoField 
                label="Postal Address" 
                value={profile.postalAddress} 
                icon={<MapPin className="w-3.5 h-3.5" />}
                isLoading={isLoadingProfile}
              />
            </div>
          )}
        </div>
      )}
    </section>
  );
};

interface InfoFieldProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  isLoading?: boolean;
}

const InfoField = ({ label, value, icon, isLoading = false }: InfoFieldProps) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2 px-1">
      <span className="text-primary-500/70">{icon}</span>
      {label}
    </label>
    <div className="p-4 bg-slate-50/50 dark:bg-white/2 border border-border rounded-2xl transition-all group-hover:border-primary-500/20 group-hover:bg-white dark:group-hover:bg-white/4">
      {isLoading ? (
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
      ) : (
        <p className="text-base font-semibold text-foreground tracking-tight">
          {value}
        </p>
      )}
    </div>
  </div>
);

// Helper function to format role names
function formatRole(role: string): string {
  const roleMap: Record<string, string> = {
    'APPLICANT': 'Applicant',
    'ADMIN_TIER1': 'Admin (Tier 1)',
    'ADMIN_TIER2': 'Admin (Tier 2)',
  };
  return roleMap[role] || role;
}