// src/components/dashboard/profile/SecuritySettings.tsx
"use client";

import React, { useState } from 'react';
import { ShieldCheck, Lock, Monitor, LogOut, ChevronRight, X, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const SecuritySettings = () => {
  const { user, changePassword } = useAuth();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [validationErrors, setValidationErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const handleOpenPasswordModal = () => {
    setIsPasswordModalOpen(true);
    setError(null);
    setSuccess(false);
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setValidationErrors({});
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setValidationErrors({});
    setError(null);
    setSuccess(false);
  };

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};
    let isValid = true;

    // Validate current password
    if (!formData.currentPassword) {
      errors.currentPassword = 'Current password is required';
      isValid = false;
    }

    // Validate new password
    if (!formData.newPassword) {
      errors.newPassword = 'New password is required';
      isValid = false;
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      errors.newPassword = 'Password must contain uppercase, lowercase, and number';
      isValid = false;
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    // Check if new password is same as current
    if (formData.currentPassword && formData.newPassword && 
        formData.currentPassword === formData.newPassword) {
      errors.newPassword = 'New password must be different from current password';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Call changePassword from AuthContext
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      setSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Close modal after 2 seconds on success
      setTimeout(() => {
        handleClosePasswordModal();
      }, 2000);

    } catch (err: any) {
      console.error('Password change error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Failed to change password';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const getPasswordStrength = (password: string): { strength: string; color: string; width: string } => {
    if (!password) return { strength: '', color: '', width: '0%' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    if (score <= 2) return { strength: 'Weak', color: 'bg-error-main', width: '33%' };
    if (score <= 4) return { strength: 'Medium', color: 'bg-yellow-500', width: '66%' };
    return { strength: 'Strong', color: 'bg-success-main', width: '100%' };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <>
      <section className="bento-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-primary-600" />
          </div>
          <h2 className="text-xl font-semibold">Security Settings</h2>
        </div>

        <div className="space-y-4">
          {/* Password Reset Trigger */}
          <button 
            onClick={handleOpenPasswordModal}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-card/50 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-slate-100 dark:bg-white/5 rounded-lg text-slate-500 group-hover:text-primary-500 transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-foreground">Change Password</h4>
                <p className="text-xs text-slate-500">Update your account password regularly</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary-500 transition-all group-hover:translate-x-1" />
          </button>

          {/* Device/Session Management
          <div className="p-4 rounded-xl border border-border bg-card/50">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-slate-100 dark:bg-white/5 rounded-lg text-slate-500">
                  <Monitor className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-foreground">Active Sessions</h4>
                  <p className="text-xs text-slate-500">You are currently logged into 2 devices</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button className="flex-1 px-4 py-2 text-xs font-semibold text-error-main bg-error-main/10 hover:bg-error-main/20 rounded-lg transition-colors flex items-center justify-center gap-2">
                <LogOut className="w-4 h-4" />
                Log out other devices
              </button>
              <div className="hidden sm:block w-px bg-border h-8 self-center" />
              <div className="flex-1 flex items-center justify-center">
                <span className="text-[10px] text-slate-400 italic">Last login: Today at 09:42 AM</span>
              </div>
            </div>
          </div> */}

        </div>
      </section>

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-background rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <Lock className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold">Change Password</h3>
              </div>
              <button
                onClick={handleClosePasswordModal}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Success Message */}
              {success && (
                <div className="p-4 rounded-lg bg-success-main/10 border border-success-main/20 animate-in slide-in-from-top duration-300">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success-main shrink-0" />
                    <div className="text-sm text-success-main">
                      <p className="font-semibold">Password changed successfully!</p>
                      <p className="text-xs mt-1">Your password has been updated.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-lg bg-error-main/10 border border-error-main/20 animate-in slide-in-from-top duration-300">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-error-main shrink-0 mt-0.5" />
                    <div className="text-sm text-error-main">
                      <p className="font-semibold">Failed to change password</p>
                      <p className="text-xs mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Current Password */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-foreground mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    id="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange('currentPassword')}
                    className={`w-full px-4 py-2.5 pr-12 bg-card border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all ${
                      validationErrors.currentPassword 
                        ? 'border-error-main focus:ring-error-main/20 focus:border-error-main' 
                        : 'border-border'
                    }`}
                    placeholder="Enter your current password"
                    disabled={isSubmitting || success}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                    disabled={isSubmitting || success}
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {validationErrors.currentPassword && (
                  <p className="text-xs text-error-main mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.currentPassword}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-foreground mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange('newPassword')}
                    className={`w-full px-4 py-2.5 pr-12 bg-card border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all ${
                      validationErrors.newPassword 
                        ? 'border-error-main focus:ring-error-main/20 focus:border-error-main' 
                        : 'border-border'
                    }`}
                    placeholder="Enter your new password"
                    disabled={isSubmitting || success}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                    disabled={isSubmitting || success}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.newPassword && !validationErrors.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-500">Password strength</span>
                      <span className={`text-xs font-semibold ${
                        passwordStrength.strength === 'Strong' ? 'text-success-main' :
                        passwordStrength.strength === 'Medium' ? 'text-yellow-500' :
                        'text-error-main'
                      }`}>
                        {passwordStrength.strength}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: passwordStrength.width }}
                      />
                    </div>
                  </div>
                )}

                {validationErrors.newPassword && (
                  <p className="text-xs text-error-main mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.newPassword}
                  </p>
                )}

                {/* Password Requirements */}
                {!validationErrors.newPassword && formData.newPassword && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-slate-500">Password must contain:</p>
                    <div className="space-y-0.5 text-xs">
                      <div className={`flex items-center gap-1.5 ${formData.newPassword.length >= 8 ? 'text-success-main' : 'text-slate-400'}`}>
                        <div className={`w-1 h-1 rounded-full ${formData.newPassword.length >= 8 ? 'bg-success-main' : 'bg-slate-300'}`} />
                        At least 8 characters
                      </div>
                      <div className={`flex items-center gap-1.5 ${/[A-Z]/.test(formData.newPassword) ? 'text-success-main' : 'text-slate-400'}`}>
                        <div className={`w-1 h-1 rounded-full ${/[A-Z]/.test(formData.newPassword) ? 'bg-success-main' : 'bg-slate-300'}`} />
                        One uppercase letter
                      </div>
                      <div className={`flex items-center gap-1.5 ${/[a-z]/.test(formData.newPassword) ? 'text-success-main' : 'text-slate-400'}`}>
                        <div className={`w-1 h-1 rounded-full ${/[a-z]/.test(formData.newPassword) ? 'bg-success-main' : 'bg-slate-300'}`} />
                        One lowercase letter
                      </div>
                      <div className={`flex items-center gap-1.5 ${/\d/.test(formData.newPassword) ? 'text-success-main' : 'text-slate-400'}`}>
                        <div className={`w-1 h-1 rounded-full ${/\d/.test(formData.newPassword) ? 'bg-success-main' : 'bg-slate-300'}`} />
                        One number
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    className={`w-full px-4 py-2.5 pr-12 bg-card border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all ${
                      validationErrors.confirmPassword 
                        ? 'border-error-main focus:ring-error-main/20 focus:border-error-main' 
                        : 'border-border'
                    }`}
                    placeholder="Confirm your new password"
                    disabled={isSubmitting || success}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                    disabled={isSubmitting || success}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="text-xs text-error-main mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClosePasswordModal}
                  className="flex-1 px-4 py-2.5 border border-border rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || success}
                  className="flex-1 px-4 py-2.5 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Changing...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Changed!
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};