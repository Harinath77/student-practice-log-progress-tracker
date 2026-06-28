import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Music4, ArrowRight, Loader2, AlertCircle, Shield, User, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read success messages passed via routing (like registration success or reset success)
  const successMessage = location.state?.message;

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
      
      // Redirect based on role and query state
      const from = location.state?.from?.pathname;
      if (profile.role.toLowerCase() === 'admin') {
        navigate(from || '/admin', { replace: true });
      } else {
        navigate(from || '/dashboard', { replace: true });
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

      <div className="max-w-md w-full space-y-8 bg-neutral-900/60 border border-neutral-800 p-8 sm:p-10 rounded-3xl backdrop-blur-md shadow-2xl relative z-10">
        
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2 text-yellow-500 hover:text-yellow-400 transition-colors">
            <Music4 className="h-8 w-8 text-yellow-500" />
            <span className="text-xl font-black uppercase tracking-wider text-white">Leveluxe</span>
          </Link>
          <h2 className="text-2xl font-extrabold tracking-tight mt-4">
            {isAdmin ? 'Admin Control Workspace' : 'Sign in to Academy'}
          </h2>
          <p className="text-neutral-450 text-xs sm:text-sm">
            {isAdmin ? 'Authenticate to manage courses, scheduling & users' : 'Access lessons, schedules and enrollments'}
          </p>
        </div>

        {/* Portal Selection Tabs */}
        <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800">
          <button
            onClick={() => { setIsAdmin(false); setError(null); }}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              !isAdmin ? 'bg-yellow-500 text-neutral-900' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Student Portal</span>
          </button>
          <button
            onClick={() => { setIsAdmin(true); setError(null); }}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              isAdmin ? 'bg-neutral-800 text-yellow-400 border border-neutral-700' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Admin Workspace</span>
          </button>
        </div>

        {/* Error/Success Alert Banners */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-950/30 border border-red-900/50 text-red-400 rounded-xl p-4 flex items-start space-x-3 text-xs"
          >
            <AlertCircle className="h-4.5 w-4.5 mt-0.5 flex-shrink-0" />
            <div className="space-y-0.5">
              <span className="font-bold">Authentication Error</span>
              <p>{error}</p>
            </div>
          </motion.div>
        )}

        {successMessage && !error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-950/30 border border-emerald-900/50 text-emerald-450 rounded-xl p-4 flex items-start space-x-3 text-xs"
          >
            <Mail className="h-4.5 w-4.5 mt-0.5 flex-shrink-0" />
            <p>{successMessage}</p>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-xs text-yellow-500 hover:underline">
                Forgot password?
              </Link>
            </div>
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
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${
              isAdmin ? 'bg-neutral-800 hover:bg-neutral-750 text-yellow-400 border border-neutral-700' : 'bg-yellow-500 hover:bg-yellow-400 text-neutral-900'
            } font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50 cursor-pointer`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </>
            )}
          </button>
        </form>

        {!isAdmin && (
          <div className="text-center pt-4 border-t border-neutral-800">
            <p className="text-xs text-neutral-450">
              Don't have an account?{' '}
              <Link to="/register" className="text-yellow-500 font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default Login;
