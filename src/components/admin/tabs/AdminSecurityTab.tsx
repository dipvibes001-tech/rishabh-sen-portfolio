import React, { useState } from 'react';
import { Shield, KeyRound, Mail, CheckCircle2, AlertCircle, Lock, Eye, EyeOff } from 'lucide-react';
import { AdminUser } from '../../../types';
import { updateAdminSecurity } from '../../../services/api';

interface AdminSecurityTabProps {
  admin: AdminUser | null;
  onAdminUpdated: (admin: AdminUser) => void;
}

export const AdminSecurityTab: React.FC<AdminSecurityTabProps> = ({ admin, onAdminUpdated }) => {
  const [email, setEmail] = useState(admin?.email || 'admin@rishabhsen.com');
  const [name, setName] = useState(admin?.name || 'Rishabh Sen');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword) {
      setError('Please enter your current administrator password to confirm changes.');
      return;
    }

    if (newPassword && newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setSaving(true);
    try {
      const res = await updateAdminSecurity({
        currentPassword,
        newPassword: newPassword || undefined,
        email,
        name,
      });

      setSuccess(res.message || 'Security settings successfully updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      if (admin) {
        onAdminUpdated({ ...admin, email, name, mustChangePassword: false });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Security update failed. Please check your credentials.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-3xl">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#65E6EA] font-mono mb-1 font-semibold">
          <Shield className="w-3.5 h-3.5" />
          <span>Access Control & Security</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
          Admin Security & Credentials
        </h1>
        <p className="text-xs sm:text-sm text-[#9CA7AD] font-sans-clean font-light mt-1">
          Manage your protected credentials with server-side bcrypt password hashing.
        </p>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-center gap-2 text-emerald-300 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl flex items-center gap-2 text-red-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Security Form */}
      <form onSubmit={handleSubmit} className="bg-[#12181C] border border-white/10 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6" autoComplete="off">
        {/* Profile info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/10 pb-2">
            Administrator Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-[#9CA7AD] block mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#080B0D] border border-white/10 focus:border-[#65E6EA] px-4 py-2.5 text-sm text-white rounded-xl outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#9CA7AD] block mb-1">
                Admin Login Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#080B0D] border border-white/10 focus:border-[#65E6EA] px-4 py-2.5 text-sm text-white rounded-xl outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Change password */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/10 pb-2">
            Update Master Password
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* New Password */}
            <div>
              <label className="text-xs uppercase tracking-wider text-[#9CA7AD] block mb-1">
                New Password (minimum 8 chars)
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Leave blank to keep unchanged"
                  minLength={8}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#080B0D] border border-white/10 focus:border-[#65E6EA] px-4 py-2.5 text-sm text-white rounded-xl outline-none transition-colors pr-10"
                />
                <button
                  type="button"
                  aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2.5 text-[#9CA7AD] hover:text-[#65E6EA] transition-colors p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65E6EA] cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="text-xs uppercase tracking-wider text-[#9CA7AD] block mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repeat new password"
                  minLength={8}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#080B0D] border border-white/10 focus:border-[#65E6EA] px-4 py-2.5 text-sm text-white rounded-xl outline-none transition-colors pr-10"
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-[#9CA7AD] hover:text-[#65E6EA] transition-colors p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65E6EA] cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Current password confirmation */}
        <div className="p-5 bg-[#080B0D] border border-[#65E6EA]/30 rounded-xl space-y-2">
          <label className="text-xs uppercase tracking-wider text-[#65E6EA] block font-semibold">
            Current Password Confirmation *
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder="Enter current password to authorize changes"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-[#12181C] border border-white/10 focus:border-[#65E6EA] px-4 py-2.5 text-sm text-white rounded-xl outline-none transition-colors pr-10"
            />
            <button
              type="button"
              aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-2.5 text-[#9CA7AD] hover:text-[#65E6EA] transition-colors p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65E6EA] cursor-pointer"
            >
              {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-[#9CA7AD] font-light">
            Required to verify your authorization before applying password or email adjustments.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 text-xs uppercase tracking-wider font-bold bg-gradient-to-r from-[#65E6EA] to-[#8B7CFF] text-[#080B0D] hover:opacity-95 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-[#65E6EA]/20 transition-all disabled:opacity-50"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{saving ? 'Updating Credentials...' : 'Save Security Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
