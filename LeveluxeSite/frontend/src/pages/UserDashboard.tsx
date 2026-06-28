import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';
import { 
  User, Music, Calendar, Clock, BookOpen, 
  CheckCircle, AlertCircle, PlayCircle, LogOut, Loader2, Bell
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface EnrollmentResponse {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  age: number;
  selected_course: string;
  experience_level: string;
  preferred_batch: string;
  message: string | null;
  status: string;
  created_at: string;
}

export const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<EnrollmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await apiClient.get<EnrollmentResponse[]>('/enrollments/me');
        setEnrollments(response.data);
      } catch (err: any) {
        setError('Could not retrieve enrollment details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="h-10 w-10 animate-spin text-yellow-500 mb-2" />
        <p className="text-sm text-neutral-400">Loading student workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background Ambience */}
      <div className="absolute top-[15%] left-[5%] w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-neutral-900 to-indigo-950/40 border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center space-x-5">
            <div className="p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 text-yellow-400">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome, {user?.full_name}!</h1>
              <p className="text-neutral-450 text-xs sm:text-sm mt-1">{user?.email} • Student Account</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link 
              to="/profile" 
              className="flex-1 sm:flex-initial text-center bg-white/5 hover:bg-white/10 text-white font-semibold py-2.5 px-5 rounded-xl border border-white/10 text-sm transition-all active:scale-95"
            >
              Edit Profile
            </Link>
            <button 
              onClick={handleLogout}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 bg-red-500/10 hover:bg-red-500/15 text-red-400 font-semibold py-2.5 px-5 rounded-xl border border-red-500/10 text-sm transition-all active:scale-95 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1 & 2: My Enrollments */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                  <Music className="h-5 w-5 text-yellow-500" />
                  My Course Bookings
                </h2>
                <span className="text-xs bg-neutral-950 border border-neutral-800 px-3 py-1 rounded-full text-neutral-400 font-semibold">
                  {enrollments.length} Program{enrollments.length !== 1 ? 's' : ''}
                </span>
              </div>

              {error && (
                <div className="bg-red-950/20 border border-red-900/50 text-red-400 rounded-xl p-4 flex items-center space-x-3 text-xs">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {enrollments.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-neutral-800 rounded-2xl space-y-4">
                  <BookOpen className="h-12 w-12 text-neutral-600 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-neutral-350">No Course Registrations Yet</p>
                    <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                      Enroll in one of our certified academy programs to begin your weekly training schedules.
                    </p>
                  </div>
                  <Link 
                    to="/courses"
                    className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold px-5 py-2 rounded-xl text-xs transition-all active:scale-95"
                  >
                    Browse Courses
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrollments.map((en) => (
                    <div 
                      key={en.id}
                      className="bg-neutral-950 border border-neutral-800/80 hover:border-neutral-700/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200"
                    >
                      <div className="space-y-2">
                        <h3 className="font-extrabold text-white text-base sm:text-lg">{en.selected_course}</h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-neutral-500" />
                            {en.preferred_batch}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-neutral-500" />
                            {en.experience_level}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-neutral-800 pt-3 sm:pt-0">
                        <span className="text-[10px] text-neutral-500">
                          Enrolled {new Date(en.created_at).toLocaleDateString()}
                        </span>
                        
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          en.status.toLowerCase() === 'approved' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                            : en.status.toLowerCase() === 'rejected'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/25'
                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/25'
                        }`}>
                          {en.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Upcoming schedules card */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-lg">
              <h3 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-yellow-500" />
                This Week's Session Slots
              </h3>
              <p className="text-xs text-neutral-400 mb-6">
                Your weekly classes will be active here once enrollment statuses are updated to "Approved".
              </p>
              
              <div className="divide-y divide-neutral-800">
                <div className="py-3.5 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                    <span>Guitar Theory & Chords</span>
                  </div>
                  <span className="text-neutral-450 text-xs">Mon, 09:00 AM • Room A</span>
                </div>
                <div className="py-3.5 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    <span>Piano Coordination Scales</span>
                  </div>
                  <span className="text-neutral-450 text-xs">Tue, 05:30 PM • Room B</span>
                </div>
              </div>
            </div>

          </div>

          {/* Column 3: Stats & Notifications */}
          <div className="space-y-8">
            
            {/* Progress Card */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-5">
              <h3 className="text-lg font-bold tracking-tight">Academic Progress</h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-neutral-350">Guitar Foundations</span>
                    <span className="text-yellow-400">12%</span>
                  </div>
                  <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-850">
                    <div className="bg-yellow-500 h-full rounded-full" style={{ width: '12%' }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-neutral-350">Piano Foundations</span>
                    <span className="text-indigo-400">0%</span>
                  </div>
                  <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-850">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: '0%' }} />
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center border-t border-neutral-800">
                <span className="text-[10px] text-neutral-500 leading-relaxed block">
                  Class progress increases automatically as you attend lessons and complete modules.
                </span>
              </div>
            </div>

            {/* Notification Center */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
              <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
                <Bell className="h-5 w-5 text-yellow-500" />
                Academy Notifications
              </h3>
              
              <div className="space-y-3.5">
                <div className="bg-neutral-950/60 border border-neutral-850 p-3.5 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-450" />
                      Enrollment Pending Review
                    </span>
                    <span className="text-[9px] text-neutral-500">Just Now</span>
                  </div>
                  <p className="text-neutral-450 leading-relaxed">
                    Thank you! Your enrollment request has been logged successfully and is currently under review by our operations crew.
                  </p>
                </div>

                <div className="bg-neutral-950/60 border border-neutral-850 p-3.5 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <PlayCircle className="h-3.5 w-3.5 text-indigo-400" />
                      Academy Portal Setup
                    </span>
                    <span className="text-[9px] text-neutral-500">2 hrs ago</span>
                  </div>
                  <p className="text-neutral-450 leading-relaxed">
                    Welcome to the Leveluxe Student Panel! Here you can check your schedule and manage enrollments.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default UserDashboard;
