// src/components/dashboard/profile/AccountStatus.tsx
"use client";

import React, { useContext, useEffect, useState } from 'react';
import { ShieldCheck, Info, BadgeCheck, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
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
  // Add account status field if available from backend
  status?: string;
  isActive?: boolean;
  lastLogin?: string;
}

export const AccountStatus = () => {
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
      setProfileError(error.response?.data?.message || 'Failed to load account status');
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

  // Helper function to format role names
  const formatRole = (role: string): string => {
    const roleMap: Record<string, string> = {
      'APPLICANT': 'Applicant',
      'ADMIN_TIER1': 'Admin (Tier 1)',
      'ADMIN_TIER2': 'Admin (Tier 2)',
    };
    return roleMap[role] || role;
  };

  // Helper function to format dates
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  // Determine account status based on available data
  const getAccountStatus = () => {
    if (profileData?.status) {
      return profileData.status;
    }
    if (profileData?.isActive !== undefined) {
      return profileData.isActive ? 'ACTIVE' : 'INACTIVE';
    }
    // Default status based on authentication
    return auth?.isAuthenticated ? 'ACTIVE' : 'UNKNOWN';
  };

  // Get account creation date
  const getAccountCreatedDate = () => {
    if (profileData?.createdAt) {
      return formatDate(profileData.createdAt);
    }
    // Fallback to context user data or default
    return "Unknown";
  };

  // Get user role with proper formatting
  const getUserRole = () => {
    if (profileData?.role) {
      return formatRole(profileData.role);
    }
    if (auth?.user?.role) {
      return formatRole(auth.user.role);
    }
    return "Unknown";
  };

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
          <p className="text-sm text-slate-500">Please log in to view account status</p>
        </div>
      </section>
    );
  }

  const accountStatus = getAccountStatus();
  const accountCreatedDate = getAccountCreatedDate();
  const userRole = getUserRole();

  return (
    <section className="bento-card p-8 overflow-hidden relative bg-card">
      {/* Decorative background element */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl" />
      
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-100 dark:bg-white/5 border border-border rounded-xl">
            <ShieldCheck className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Account Status</h2>
            <p className="text-xs text-slate-400 mt-0.5 uppercase tracking-widest font-medium">Live Account Information</p>
          </div>
        </div>

        {/* Refresh button */}
        <button
          onClick={fetchUserProfile}
          disabled={isLoadingProfile}
          className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refresh account status"
        >
          <RefreshCw className={`w-4 h-4 text-slate-500 ${isLoadingProfile ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Error state */}
      {profileError && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900 dark:text-red-200">Failed to load account status</p>
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
      {isLoadingProfile && !profileData && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <Loader2 className="w-6 h-6 text-primary-500 animate-spin mx-auto" />
            <p className="text-sm text-slate-500">Loading account details...</p>
          </div>
        </div>
      )}

      {/* Account information */}
      {(!isLoadingProfile || profileData) && (
        <>
          <div className="space-y-5">
            {/* Role Badge */}
            <div className="p-6 rounded-2xl bg-white dark:bg-white/2 border border-border shadow-xs flex items-start gap-4">
              <div className="mt-1 shrink-0 p-1 bg-success-main/10 rounded-full">
                <BadgeCheck className="w-5 h-5 text-success-main" />
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Role</p>
                <p className="text-xl font-black text-foreground leading-none py-1">
                  {userRole}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Full access to SME & Payroll loan applications.
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="p-6 rounded-2xl bg-white dark:bg-white/2 border border-border shadow-xs flex items-start gap-4">
              <div className="mt-2 shrink-0">
                <div className={`w-3 h-3 rounded-full ${
                  accountStatus === 'ACTIVE' 
                    ? 'bg-success-main animate-pulse shadow-[0_0_10px_rgba(40,167,69,0.4)]' 
                    : accountStatus === 'INACTIVE'
                    ? 'bg-amber-500'
                    : 'bg-slate-400'
                }`} />
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Status</p>
                <p className="text-xl font-black text-foreground leading-none py-1">
                  {accountStatus}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Member since <span className="font-medium">{accountCreatedDate}</span>
                  {profileData?.lastLogin && (
                    <> • Last login: <span className="font-medium">{formatDate(profileData.lastLogin)}</span></>
                  )}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};