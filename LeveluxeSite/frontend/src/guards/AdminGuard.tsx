import React from 'react';
import { Navigate, Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShieldAlert, ArrowLeft } from 'lucide-react';

interface AdminGuardProps {
  children?: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="h-10 w-10 animate-spin text-yellow-500 mb-4" />
        <p className="text-sm font-semibold tracking-wider text-neutral-400">Verifying permissions...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role.toLowerCase() !== 'admin') {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4 py-16 text-white relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-red-500/5 blur-[120px] -z-10" />

        <div className="max-w-md w-full text-center space-y-6 bg-neutral-900 border border-neutral-800 p-8 sm:p-10 rounded-3xl shadow-2xl relative z-10">
          <div className="inline-flex p-4 bg-red-500/10 rounded-full border border-red-500/20 text-red-500 animate-pulse">
            <ShieldAlert className="h-12 w-12" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">Access Forbidden</h1>
            <p className="text-neutral-400 text-sm leading-relaxed">
              You do not have the administrative permissions required to view this panel. Please check your credentials or head back.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-4">
            <Link
              to="/dashboard"
              className="flex-1 inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold py-3 px-6 rounded-xl transition-all duration-200 active:scale-95 text-sm"
            >
              User Dashboard
            </Link>
            <Link
              to="/"
              className="flex-1 inline-flex items-center justify-center bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-6 rounded-xl border border-white/10 transition-all duration-200 active:scale-95 text-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
};

export default AdminGuard;
