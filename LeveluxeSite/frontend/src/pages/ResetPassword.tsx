import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Music4, ArrowRight, Loader2, AlertCircle, Lock, Key } from 'lucide-react';
import apiClient from '../services/apiClient';
import { motion } from 'framer-motion';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fill token from query parameters if present
  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('A valid reset token is required.');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.post('/auth/reset-password', {
        token,
        new_password: newPassword,
      });
      // Redirect to login on success
      navigate('/login', {
        state: { message: 'Password reset successfully! You can now log in with your new password.' }
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Reset failed. Your token may be invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center px-4 py-24 relative overflow-hidden text-white">
      {/* Background glow effects */}
      <div className="absolute top-[10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[100px] -z-10" />
      <div className="absolute bottom-[10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-yellow-500/5 blur-[100px] -z-10" />

      <div className="max-w-md w-full space-y-8 bg-neutral-900/60 border border-neutral-800 p-8 sm:p-10 rounded-3xl backdrop-blur-md shadow-2xl relative z-10">
        
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2 text-yellow-500 hover:text-yellow-400 transition-colors">
            <Music4 className="h-8 w-8 text-yellow-500" />
            <span className="text-xl font-black uppercase tracking-wider text-white">Leveluxe</span>
          </Link>
          <h2 className="text-2xl font-extrabold tracking-tight mt-4">Reset Password</h2>
          <p className="text-neutral-450 text-xs sm:text-sm">
            Enter your verification token and secure a new password
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-950/30 border border-red-900/50 text-red-400 rounded-xl p-4 flex items-start space-x-3 text-xs"
          >
            <AlertCircle className="h-4.5 w-4.5 mt-0.5 flex-shrink-0" />
            <div className="space-y-0.5">
              <span className="font-bold">Reset Failure</span>
              <p>{error}</p>
            </div>
          </motion.div>
        )}

        {/* Reset Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Reset Token</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                <Key className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl pl-10 pr-4 py-3 text-sm placeholder-neutral-600 focus:outline-none transition-colors"
                placeholder="Paste simulated token here"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">New Password</label>
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
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Confirm New Password</label>
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50 mt-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                <span>Resetting password...</span>
              </>
            ) : (
              <>
                <span>Change Password</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-neutral-800">
          <Link to="/login" className="text-xs text-neutral-400 hover:text-white transition-colors">
            Back to Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
