import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, AlertCircle, ArrowLeft, Shield, Eye, EyeOff, KeyRound, CheckCircle2 } from 'lucide-react';
import { adminLogin, updateAdminSecurity } from '../../services/api';
import { AdminUser } from '../../types';
import { Card3D } from '../common/Card3D';

interface AdminLoginProps {
  onLoginSuccess: (admin: AdminUser) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToSite }) => {
  // 1. Fields always start completely empty
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forced password change state
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [authenticatedAdmin, setAuthenticatedAdmin] = useState<AdminUser | null>(null);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your administrator email address.');
      return;
    }
    if (!password) {
      setError('Please enter your administrator password.');
      return;
    }

    setLoading(true);

    try {
      const res = await adminLogin(email.trim(), password);
      // Check if server flag indicates initial temporary password must be changed
      if (res.admin.mustChangePassword) {
        setAuthenticatedAdmin(res.admin);
        setCurrentPasswordInput(password); // Pre-set current password for convenience in the change form
        setMustChangePassword(true);
        setPassword('');
      } else {
        onLoginSuccess(res.admin);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed. Please verify your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForcePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setChangePasswordSuccess(null);

    if (!currentPasswordInput) {
      setError('Please enter your current temporary password.');
      return;
    }
    if (!newPasswordInput || newPasswordInput.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setError('New password and confirmation do not match.');
      return;
    }
    if (newPasswordInput === currentPasswordInput) {
      setError('New password must be different from your temporary password.');
      return;
    }

    setLoading(true);
    try {
      await updateAdminSecurity({
        currentPassword: currentPasswordInput,
        newPassword: newPasswordInput,
      });

      setChangePasswordSuccess('Password successfully updated. Proceeding to console...');
      
      const updatedAdmin: AdminUser = {
        ...(authenticatedAdmin || {
          id: 'admin_default_1',
          email: email.trim(),
          name: 'Rishabh Sen',
        }),
        mustChangePassword: false,
      };

      setTimeout(() => {
        onLoginSuccess(updatedAdmin);
      }, 700);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update password. Please check your current password.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B0D] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-[#65E6EA] selection:text-[#080B0D]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[400px] bg-gradient-to-b from-[#65E6EA]/15 via-[#8B7CFF]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* Back to site button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onBackToSite}
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#9CA7AD] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Website</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Header Icon & Title */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#12181C] border border-[#65E6EA]/30 flex items-center justify-center mx-auto mb-4 text-[#65E6EA] shadow-[0_0_25px_rgba(101,230,234,0.25)]">
            {mustChangePassword ? <KeyRound className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>

          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            {mustChangePassword ? 'Change Your Password' : 'Studio CMS Portal'}
          </h2>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#65E6EA] font-semibold font-sans-clean">
            {mustChangePassword ? 'Security Bootstrap Requirement' : 'Rishabh Sen · Executive Access'}
          </p>
        </div>

        <Card3D maxTilt={5} glareOpacity={0.15}>
          <div className="bg-[#12181C] py-8 px-6 sm:px-10 border border-white/10 rounded-2xl shadow-2xl">
            {/* Error banner */}
            {error && (
              <div className="mb-6 p-4 bg-red-950/40 border border-red-800/60 rounded-xl flex items-start gap-3 text-red-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <div>
                  <p className="font-semibold mb-0.5">Authentication Refused</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Success banner */}
            {changePasswordSuccess && (
              <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-start gap-3 text-emerald-300 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <div>
                  <p className="font-semibold mb-0.5">Security Updated</p>
                  <p>{changePasswordSuccess}</p>
                </div>
              </div>
            )}

            {/* 4. FORCE PASSWORD CHANGE FORM */}
            {mustChangePassword ? (
              <form onSubmit={handleForcePasswordChange} className="space-y-5" autoComplete="off">
                <div className="p-3.5 bg-[#080B0D] border border-amber-500/30 rounded-xl text-xs text-[#9CA7AD] leading-relaxed">
                  <span className="text-amber-400 font-semibold block mb-1">Temporary Password In Use</span>
                  Your account was initialized with a temporary bootstrap password. You must set a permanent private password (minimum 8 characters) to proceed.
                </div>

                {/* Current Password Field */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/80 block font-semibold mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={currentPasswordInput}
                      onChange={(e) => setCurrentPasswordInput(e.target.value)}
                      placeholder="Enter temporary password"
                      className="w-full bg-[#080B0D] border border-white/10 focus:border-[#65E6EA] px-4 py-3 text-sm text-white rounded-xl outline-none transition-colors pl-10 pr-11"
                    />
                    <Lock className="w-4 h-4 text-[#9CA7AD] absolute left-3.5 top-3.5" />
                    <button
                      type="button"
                      aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3.5 top-3 text-[#9CA7AD] hover:text-[#65E6EA] transition-colors p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65E6EA] cursor-pointer"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password Field */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/80 block font-semibold mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full bg-[#080B0D] border border-white/10 focus:border-[#65E6EA] px-4 py-3 text-sm text-white rounded-xl outline-none transition-colors pl-10 pr-11"
                    />
                    <KeyRound className="w-4 h-4 text-[#9CA7AD] absolute left-3.5 top-3.5" />
                    <button
                      type="button"
                      aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-3 text-[#9CA7AD] hover:text-[#65E6EA] transition-colors p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65E6EA] cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password Field */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/80 block font-semibold mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full bg-[#080B0D] border border-white/10 focus:border-[#65E6EA] px-4 py-3 text-sm text-white rounded-xl outline-none transition-colors pl-10 pr-11"
                    />
                    <KeyRound className="w-4 h-4 text-[#9CA7AD] absolute left-3.5 top-3.5" />
                    <button
                      type="button"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-3 text-[#9CA7AD] hover:text-[#65E6EA] transition-colors p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65E6EA] cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 text-xs uppercase tracking-[0.2em] font-bold text-[#080B0D] bg-gradient-to-r from-[#65E6EA] via-[#8B7CFF] to-[#C56CFF] hover:opacity-95 disabled:opacity-50 transition-all rounded-xl shadow-[0_0_20px_rgba(101,230,234,0.3)] flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  {loading ? (
                    <span>Securing New Password...</span>
                  ) : (
                    <>
                      <span>Establish Password & Enter</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* STANDARD LOGIN FORM */
              <form onSubmit={handleLoginSubmit} className="space-y-6" autoComplete="off">
                {/* 1. Email field - MUST start completely empty */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/80 block font-semibold mb-2">
                    Email / Gmail
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      autoComplete="off"
                      placeholder="Enter administrator email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#080B0D] border border-white/10 focus:border-[#65E6EA] px-4 py-3 text-sm text-white placeholder-[#9CA7AD]/40 rounded-xl outline-none transition-colors pl-10"
                    />
                    <Mail className="w-4 h-4 text-[#9CA7AD] absolute left-3.5 top-3.5" />
                  </div>
                </div>

                {/* 2. Password field with show/hide eye toggle button */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/80 block font-semibold mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="off"
                      placeholder="Enter administrator password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#080B0D] border border-white/10 focus:border-[#65E6EA] px-4 py-3 text-sm text-white placeholder-[#9CA7AD]/40 rounded-xl outline-none transition-colors pl-10 pr-11"
                    />
                    <Lock className="w-4 h-4 text-[#9CA7AD] absolute left-3.5 top-3.5" />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-[#9CA7AD] hover:text-[#65E6EA] transition-colors p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65E6EA] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 text-xs uppercase tracking-[0.2em] font-bold text-[#080B0D] bg-gradient-to-r from-[#65E6EA] via-[#8B7CFF] to-[#C56CFF] hover:opacity-95 disabled:opacity-50 transition-all rounded-xl shadow-[0_0_20px_rgba(101,230,234,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <span>Enter Studio Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Footer security note */}
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#9CA7AD]">
                <Shield className="w-3.5 h-3.5 text-[#65E6EA]" />
                <span>Bcrypt Hash + Encrypted Session Validation</span>
              </div>
            </div>
          </div>
        </Card3D>
      </div>
    </div>
  );
};
