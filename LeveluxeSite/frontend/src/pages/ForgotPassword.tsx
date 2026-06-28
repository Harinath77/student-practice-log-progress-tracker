import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Music4, ArrowRight, Loader2, AlertCircle, Mail } from 'lucide-react';
import apiClient from '../services/apiClient';
import { motion } from 'framer-motion';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [simulatedToken, setSimulatedToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setSimulatedToken(null);

    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      setSuccess(response.data.message);
      if (response.data.simulated_token) {
        // Build a simulated token that carries the email so the reset script can link it
        setSimulatedToken(`reset-${email}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred. Please try again.');
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
          <h2 className="text-2xl font-extrabold tracking-tight mt-4">Forgot Password?</h2>
          <p className="text-neutral-450 text-xs sm:text-sm">
            Enter your email to receive password reset instructions
          </p>
        </div>

        {/* Error/Success Alert Banners */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-950/30 border border-red-900/50 text-red-400 rounded-xl p-4 flex items-start space-x-3 text-xs"
          >
            <AlertCircle className="h-4.5 w-4.5 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-950/30 border border-emerald-900/50 text-emerald-400 rounded-xl p-4 space-y-3 text-xs"
          >
            <div className="flex items-start space-x-3">
              <Mail className="h-4.5 w-4.5 mt-0.5 flex-shrink-0 text-emerald-450" />
              <p>{success}</p>
            </div>
            {simulatedToken && (
              <div className="mt-2 bg-neutral-900/90 border border-neutral-800 p-3 rounded-lg text-[10px] space-y-1.5 text-neutral-300">
                <span className="font-bold text-yellow-500 uppercase tracking-wide block">Simulation Bypass Helper:</span>
                <p>Since email dispatch is not active on this environment, use the token below to update your password:</p>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <code className="text-white font-mono bg-neutral-950 px-2 py-1 rounded select-all break-all flex-1">{simulatedToken}</code>
                  <Link 
                    to={`/reset-password?token=${simulatedToken}`}
                    className="bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold px-2.5 py-1 rounded text-[9px] transition-colors flex-shrink-0"
                  >
                    Reset Now
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Forgot Password Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl pl-10 pr-4 py-3 text-sm placeholder-neutral-600 focus:outline-none transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>Sending request...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Request</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="text-center pt-4 border-t border-neutral-800 flex justify-between items-center text-xs">
          <Link to="/login" className="text-neutral-400 hover:text-white transition-colors">
            Back to Sign In
          </Link>
          <Link to="/register" className="text-yellow-500 font-bold hover:underline">
            Register Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
