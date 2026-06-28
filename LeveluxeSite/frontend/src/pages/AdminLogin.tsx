import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Music4, ArrowRight, Loader2, AlertCircle, Shield, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, logout } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all credentials.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const profile = await login(email, password, rememberMe);
      
      // Enforce Admin checks on the dashboard login
      if (profile.role.toLowerCase() !== 'admin') {
        // Immediately sign out to clear access tokens
        await logout();
        setError('Access restricted to administrators only.');
      } else {
        const from = location.state?.from?.pathname;
        navigate(from || '/admin', { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Incorrect email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center px-4 py-24 relative overflow-hidden text-white">
      {/* Background glow effects */}
      <div className="absolute top-[10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[100px] -z-10" />
      <div className="absolute bottom-[10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-yellow-500/5 blur-[100px] -z-10" />

      <div className="max-w-md w-full space-y-8 bg-neutral-900/60 border border-neutral-855 p-8 sm:p-10 rounded-3xl backdrop-blur-md shadow-2xl relative z-10">
        
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2">
            <Music4 className="h-8 w-8 text-yellow-500 animate-pulse" />
            <span className="text-xl font-black uppercase tracking-wider text-white">Leveluxe</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight mt-4 flex items-center justify-center gap-2">
            <Shield className="h-5 w-5 text-yellow-500" />
            Admin Command Gateway
          </h2>
          <p className="text-neutral-450 text-xs sm:text-sm">
            Enter administrative credentials to gain server access
          </p>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-950/30 border border-red-900/50 text-red-400 rounded-xl p-4 flex items-start space-x-3 text-xs"
          >
            <AlertCircle className="h-4.5 w-4.5 mt-0.5 flex-shrink-0" />
            <div className="space-y-0.5">
              <span className="font-bold">Security Failure</span>
              <p>{error}</p>
            </div>
          </motion.div>
        )}

        {/* Admin Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Admin Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl pl-10 pr-4 py-3 text-sm placeholder-neutral-600 focus:outline-none transition-colors"
                placeholder="admin@leveluxe.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Access Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl pl-10 pr-4 py-3 text-sm placeholder-neutral-600 focus:outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 text-xs text-neutral-450 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-neutral-950 border-neutral-800 text-yellow-500 focus:ring-0 focus:ring-offset-0 h-4 w-4 cursor-pointer"
              />
              <span>Keep session active</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-neutral-850 hover:bg-neutral-800 border border-neutral-700 text-yellow-500 font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50 cursor-pointer mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                <span>Authorizing access...</span>
              </>
            ) : (
              <>
                <span>Enter Dashboard</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-neutral-805">
          <Link to="/" className="text-xs text-neutral-450 hover:text-white transition-colors">
            Return to Homepage
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default AdminLogin;
