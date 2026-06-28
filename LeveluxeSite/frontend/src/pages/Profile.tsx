import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';
import { 
  User, Lock, Key, CheckCircle, AlertCircle, Loader2, 
  Mail, Phone, Shield, ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Profile: React.FC = () => {
  const { user, refreshProfile } = useAuth();

  // Profile fields state
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(null);
    setProfileError(null);

    if (!fullName) {
      setProfileError('Full Name is required.');
      return;
    }

    setIsProfileUpdating(true);

    try {
      // Endpoint to update current user's profile
      await apiClient.put(`/admin/users/${user?.id}`, {
        full_name: fullName,
        phone: phone || null,
      });
      await refreshProfile();
      setProfileSuccess('Profile details successfully updated!');
    } catch (err: any) {
      setProfileError(err.response?.data?.detail || 'Failed to update profile details.');
    } finally {
      setIsProfileUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(null);
    setPasswordError(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    setIsPasswordUpdating(true);

    try {
      await apiClient.post('/auth/change-password', {
        old_password: oldPassword,
        new_password: newPassword,
      });
      setPasswordSuccess('Password successfully updated!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.response?.data?.detail || 'Failed to update password. Verify current password.');
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background ambience */}
      <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] -z-10" />

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation back */}
        <div>
          <Link 
            to={user?.role.toLowerCase() === 'admin' ? '/admin' : '/dashboard'}
            className="inline-flex items-center text-xs text-neutral-450 hover:text-white transition-colors"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight">Account Profile Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Account Details Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-6 text-center">
              <div className="inline-flex p-4 bg-yellow-500/10 rounded-full border border-yellow-500/25 text-yellow-500">
                <User className="h-10 w-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white leading-snug">{user?.full_name}</h3>
                <p className="text-xs text-neutral-400">{user?.email}</p>
                <div className="inline-flex items-center space-x-1.5 text-[10px] bg-neutral-950 border border-neutral-800/80 text-yellow-500 uppercase tracking-widest font-bold px-3 py-1 rounded-full mt-2">
                  <Shield className="h-3 w-3" />
                  <span>{user?.role}</span>
                </div>
              </div>
              <div className="border-t border-neutral-800/80 pt-4 text-xs text-neutral-450 text-left space-y-2">
                <p>Joined Academy: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
                <p>Last Login: {user?.last_login ? new Date(user.last_login).toLocaleTimeString() : 'Just now'}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Update Forms */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Details Form */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
              <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <User className="h-5 w-5 text-yellow-500" />
                Profile Information
              </h2>
              
              {profileSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-950/30 border border-emerald-900/50 text-emerald-450 rounded-xl p-4 flex items-center space-x-3 text-xs"
                >
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-450 flex-shrink-0" />
                  <p>{profileSuccess}</p>
                </motion.div>
              )}

              {profileError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-950/30 border border-red-900/50 text-red-450 rounded-xl p-4 flex items-center space-x-3 text-xs"
                >
                  <AlertCircle className="h-4.5 w-4.5 text-red-400 flex-shrink-0" />
                  <p>{profileError}</p>
                </motion.div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Email Address (Read-only)</label>
                  <div className="relative opacity-60">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="w-full bg-neutral-950 border border-neutral-850 rounded-xl pl-10 pr-4 py-3 text-sm placeholder-neutral-600 focus:outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Full Name *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                        <User className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl pl-10 pr-4 py-3 text-sm placeholder-neutral-600 focus:outline-none transition-colors"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Phone Number</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                        <Phone className="h-4 w-4" />
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl pl-10 pr-4 py-3 text-sm placeholder-neutral-600 focus:outline-none transition-colors"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProfileUpdating}
                  className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold px-6 py-3 rounded-xl transition-all active:scale-95 disabled:opacity-50 text-sm cursor-pointer shadow-md shadow-yellow-500/10"
                >
                  {isProfileUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving changes...
                    </>
                  ) : (
                    'Save Details'
                  )}
                </button>
              </form>
            </div>

            {/* Password Form */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
              <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <Lock className="h-5 w-5 text-yellow-500" />
                Change Password
              </h2>
              
              {passwordSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-950/30 border border-emerald-900/50 text-emerald-450 rounded-xl p-4 flex items-center space-x-3 text-xs"
                >
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-450 flex-shrink-0" />
                  <p>{passwordSuccess}</p>
                </motion.div>
              )}

              {passwordError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-950/30 border border-red-900/50 text-red-450 rounded-xl p-4 flex items-center space-x-3 text-xs"
                >
                  <AlertCircle className="h-4.5 w-4.5 text-red-400 flex-shrink-0" />
                  <p>{passwordError}</p>
                </motion.div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Current Password *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                      <Key className="h-4 w-4" />
                    </span>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl pl-10 pr-4 py-3 text-sm placeholder-neutral-600 focus:outline-none transition-colors"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">New Password *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                        <Lock className="h-4 w-4" />
                      </span>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl pl-10 pr-4 py-3 text-sm placeholder-neutral-600 focus:outline-none transition-colors"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Confirm New Password *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                        <Lock className="h-4 w-4" />
                      </span>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl pl-10 pr-4 py-3 text-sm placeholder-neutral-600 focus:outline-none transition-colors"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPasswordUpdating}
                  className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold px-6 py-3 rounded-xl transition-all active:scale-95 disabled:opacity-50 text-sm cursor-pointer shadow-md shadow-yellow-500/10"
                >
                  {isPasswordUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
