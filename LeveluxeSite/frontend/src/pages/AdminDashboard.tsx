import React, { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Users, Calendar, ClipboardList, 
  UserCheck, History, Settings, LogOut, Check, X, Loader2, Plus, 
  Edit2, Trash2, Search, Filter, Download, AlertCircle, CheckCircle, 
  Key, Globe, RefreshCw, Music4
} from 'lucide-react';

// --- Types ---
interface UserResponse {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

interface CourseResponse {
  id: number;
  title: string;
  instrument: string;
  level: string;
  duration: string;
  fees: number;
  description: string;
  image_url: string;
}

interface InstructorResponse {
  id: number;
  full_name: string;
  instrument: string;
  qualification: string;
  experience_years: number;
  bio: string;
  languages: string;
  specialization: string;
  image_url: string;
}

interface ScheduleResponse {
  id: number;
  course_name: string;
  instructor: string;
  day: string;
  start_time: string;
  end_time: string;
  batch: string;
  level: string;
  room: string;
  available_seats: number;
}

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

interface AuditLogResponse {
  id: number;
  timestamp: string;
  admin_name: string;
  action: string;
  resource: string;
  old_values: string | null;
  new_values: string | null;
  ip_address: string | null;
  user_agent: string | null;
}

interface Analytics {
  total_students: number;
  total_courses: number;
  total_instructors: number;
  total_enrollments: number;
  pending_enrollments: number;
  today_classes: Array<{
    id: number;
    course_name: string;
    instructor: string;
    room: string;
    start_time: string;
    end_time: string;
    batch: string;
  }>;
  recent_enrollments: Array<{
    id: number;
    full_name: string;
    selected_course: string;
    preferred_batch: string;
    created_at: string;
    status: string;
  }>;
}

export const AdminDashboard: React.FC = () => {
  const { user: currentAdmin, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'instructors' | 'schedules' | 'enrollments' | 'users' | 'audit' | 'settings'>('dashboard');

  // Lists Data
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [instructors, setInstructors] = useState<InstructorResponse[]>([]);
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentResponse[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogResponse[]>([]);

  // Search & Filter state
  const [enrollmentSearch, setEnrollmentSearch] = useState('');
  const [enrollmentFilter, setEnrollmentFilter] = useState('All');
  const [userSearch, setUserSearch] = useState('');
  const [auditSearch, setAuditSearch] = useState('');
  const [auditResourceSearch, setAuditResourceSearch] = useState('');

  // Loading & Feedbacks
  const [isLoading, setIsLoading] = useState(true);
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);
  const [alertError, setAlertError] = useState<string | null>(null);

  // Forms States
  const [courseForm, setCourseForm] = useState({ id: 0, title: '', instrument: '', level: 'Beginner', duration: '', fees: 0, description: '', image_url: '' });
  const [isCourseFormOpen, setIsCourseFormOpen] = useState(false);

  const [instructorForm, setInstructorForm] = useState({ id: 0, full_name: '', instrument: '', qualification: '', experience_years: 0, bio: '', languages: '', specialization: '', image_url: '' });
  const [isInstructorFormOpen, setIsInstructorFormOpen] = useState(false);

  const [scheduleForm, setScheduleForm] = useState({ id: 0, course_name: '', instructor: '', day: 'Monday', start_time: '', end_time: '', batch: 'Morning Batch', level: 'Beginner', room: '', available_seats: 10 });
  const [isScheduleFormOpen, setIsScheduleFormOpen] = useState(false);

  const [userForm, setUserForm] = useState({ id: 0, role: '', is_active: true });
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);

  const [userResetPwForm, setUserResetPwForm] = useState({ id: 0, email: '', new_password: '' });
  const [isResetPwOpen, setIsResetPwOpen] = useState(false);

  const [selectedUserHistory, setSelectedUserHistory] = useState<EnrollmentResponse[]>([]);
  const [historyUserEmail, setHistoryUserEmail] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Change Admin Password Form (Settings)
  const [adminChangePw, setAdminChangePw] = useState({ old_password: '', new_password: '', confirm_password: '' });

  // Load Data
  const loadData = async () => {
    setIsLoading(true);
    setAlertSuccess(null);
    setAlertError(null);

    try {
      if (activeTab === 'dashboard') {
        const res = await apiClient.get<Analytics>('/admin/analytics');
        setAnalytics(res.data);
      } else if (activeTab === 'users') {
        const res = await apiClient.get<UserResponse[]>('/admin/users');
        setUsers(res.data);
      } else if (activeTab === 'courses') {
        const res = await apiClient.get<CourseResponse[]>('/courses');
        setCourses(res.data);
      } else if (activeTab === 'instructors') {
        const res = await apiClient.get<InstructorResponse[]>('/instructors');
        setInstructors(res.data);
      } else if (activeTab === 'schedules') {
        const res = await apiClient.get<ScheduleResponse[]>('/schedule');
        setSchedules(res.data);
      } else if (activeTab === 'enrollments') {
        const res = await apiClient.get<EnrollmentResponse[]>('/admin/enrollments');
        setEnrollments(res.data);
      } else if (activeTab === 'audit') {
        // Query logs
        const params: Record<string, string> = {};
        if (auditSearch) params.action = auditSearch;
        if (auditResourceSearch) params.resource = auditResourceSearch;
        
        const res = await apiClient.get<AuditLogResponse[]>('/admin/audit-logs', { params });
        setAuditLogs(res.data);
      }
    } catch (err: any) {
      setAlertError('Failed to fetch admin dashboard records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const triggerFeedback = (successMsg: string | null, errorMsg: string | null = null) => {
    setAlertSuccess(successMsg);
    setAlertError(errorMsg);
    setTimeout(() => {
      setAlertSuccess(null);
      setAlertError(null);
    }, 4500);
  };

  // --- Actions ---

  // Enrollments Toggles
  const handleUpdateEnrollment = async (id: number, status: string) => {
    try {
      await apiClient.put(`/admin/enrollments/${id}`, { status });
      triggerFeedback(`Enrollment successfully marked as ${status}.`);
      loadData();
    } catch (err: any) {
      triggerFeedback(null, 'Failed to update enrollment status.');
    }
  };

  const handleCancelEnrollment = async (id: number) => {
    if (!confirm('Are you sure you want to cancel and delete this enrollment request?')) return;
    try {
      await apiClient.delete(`/admin/enrollments/${id}`);
      triggerFeedback('Enrollment successfully cancelled.');
      loadData();
    } catch (err: any) {
      triggerFeedback(null, 'Failed to cancel enrollment.');
    }
  };

  // Users Controls
  const handleUserUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.put(`/admin/users/${userForm.id}`, {
        role: userForm.role,
        is_active: userForm.is_active
      });
      setIsUserFormOpen(false);
      triggerFeedback('User privileges updated successfully.');
      loadData();
    } catch (err: any) {
      triggerFeedback(null, 'Failed to update user parameters.');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user account permanently?')) return;
    try {
      await apiClient.delete(`/admin/users/${id}`);
      triggerFeedback('User account deleted successfully.');
      loadData();
    } catch (err: any) {
      triggerFeedback(null, 'Failed to delete user account.');
    }
  };

  const handleUserPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userResetPwForm.new_password) return;
    try {
      await apiClient.post(`/admin/users/${userResetPwForm.id}/reset-password`, {
        new_password: userResetPwForm.new_password
      });
      setIsResetPwOpen(false);
      triggerFeedback(`Password for ${userResetPwForm.email} successfully updated.`);
      loadData();
    } catch (err: any) {
      triggerFeedback(null, 'Failed to reset user password.');
    }
  };

  const handleViewUserHistory = async (u: UserResponse) => {
    setHistoryUserEmail(u.email);
    setIsLoading(true);
    try {
      const res = await apiClient.get<EnrollmentResponse[]>(`/admin/users/${u.id}/history`);
      setSelectedUserHistory(res.data);
      setIsHistoryOpen(true);
    } catch (err: any) {
      triggerFeedback(null, 'Failed to fetch user enrollment history.');
    } finally {
      setIsLoading(false);
    }
  };

  // Courses
  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: courseForm.title,
        instrument: courseForm.instrument,
        level: courseForm.level,
        duration: courseForm.duration,
        fees: Number(courseForm.fees),
        description: courseForm.description,
        image_url: courseForm.image_url || '/images/guitar.png'
      };

      if (courseForm.id > 0) {
        await apiClient.put(`/admin/courses/${courseForm.id}`, payload);
        triggerFeedback('Course updated successfully.');
      } else {
        await apiClient.post('/admin/courses', payload);
        triggerFeedback('New course created successfully.');
      }
      setIsCourseFormOpen(false);
      loadData();
    } catch (err: any) {
      triggerFeedback(null, 'Course configuration failed.');
    }
  };

  const handleDeleteCourse = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course permanently?')) return;
    try {
      await apiClient.delete(`/admin/courses/${id}`);
      triggerFeedback('Course deleted successfully.');
      loadData();
    } catch (err: any) {
      triggerFeedback(null, 'Failed to delete course.');
    }
  };

  // Instructors
  const handleInstructorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        full_name: instructorForm.full_name,
        instrument: instructorForm.instrument,
        qualification: instructorForm.qualification,
        experience_years: Number(instructorForm.experience_years),
        bio: instructorForm.bio,
        languages: instructorForm.languages,
        specialization: instructorForm.specialization,
        image_url: instructorForm.image_url || ''
      };

      if (instructorForm.id > 0) {
        await apiClient.put(`/admin/instructors/${instructorForm.id}`, payload);
        triggerFeedback('Instructor profile updated successfully.');
      } else {
        await apiClient.post('/admin/instructors', payload);
        triggerFeedback('New instructor profile registered.');
      }
      setIsInstructorFormOpen(false);
      loadData();
    } catch (err: any) {
      triggerFeedback(null, 'Instructor configuration failed.');
    }
  };

  const handleDeleteInstructor = async (id: number) => {
    if (!confirm('Delete this instructor?')) return;
    try {
      await apiClient.delete(`/admin/instructors/${id}`);
      triggerFeedback('Instructor profile deleted successfully.');
      loadData();
    } catch (err: any) {
      triggerFeedback(null, 'Failed to delete instructor.');
    }
  };

  // Schedules
  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        course_name: scheduleForm.course_name,
        instructor: scheduleForm.instructor,
        day: scheduleForm.day,
        start_time: scheduleForm.start_time,
        end_time: scheduleForm.end_time,
        batch: scheduleForm.batch,
        level: scheduleForm.level,
        room: scheduleForm.room,
        available_seats: Number(scheduleForm.available_seats)
      };

      if (scheduleForm.id > 0) {
        await apiClient.put(`/admin/schedule/${scheduleForm.id}`, payload);
        triggerFeedback('Schedule slot successfully updated.');
      } else {
        await apiClient.post('/admin/schedule', payload);
        triggerFeedback('New schedule slot created.');
      }
      setIsScheduleFormOpen(false);
      loadData();
    } catch (err: any) {
      triggerFeedback(null, 'Schedule configuration failed.');
    }
  };

  const handleDeleteSchedule = async (id: number) => {
    if (!confirm('Delete this schedule slot?')) return;
    try {
      await apiClient.delete(`/admin/schedule/${id}`);
      triggerFeedback('Schedule slot deleted successfully.');
      loadData();
    } catch (err: any) {
      triggerFeedback(null, 'Failed to delete schedule slot.');
    }
  };

  // Change Admin Password (Settings tab)
  const handleAdminChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminChangePw.new_password !== adminChangePw.confirm_password) {
      triggerFeedback(null, 'New passwords do not match.');
      return;
    }
    try {
      await apiClient.post('/auth/change-password', {
        old_password: adminChangePw.old_password,
        new_password: adminChangePw.new_password
      });
      triggerFeedback('Password changed successfully.');
      setAdminChangePw({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err: any) {
      triggerFeedback(null, err.response?.data?.detail || 'Failed to change admin password.');
    }
  };

  // --- Export CSV Helper ---
  const exportEnrollmentsCSV = () => {
    const filtered = enrollments.filter(en => {
      const matchSearch = en.full_name.toLowerCase().includes(enrollmentSearch.toLowerCase()) || 
                          en.email.toLowerCase().includes(enrollmentSearch.toLowerCase()) ||
                          en.selected_course.toLowerCase().includes(enrollmentSearch.toLowerCase());
      const matchFilter = enrollmentFilter === 'All' || en.status === enrollmentFilter;
      return matchSearch && matchFilter;
    });

    if (filtered.length === 0) {
      alert('No enrollments match the current criteria for export.');
      return;
    }

    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Age', 'Selected Course', 'Level', 'Batch', 'Status', 'Date Booked'];
    const csvRows = [headers.join(',')];

    filtered.forEach(en => {
      const row = [
        en.id,
        `"${en.full_name.replace(/"/g, '""')}"`,
        `"${en.email}"`,
        `"${en.phone}"`,
        en.age,
        `"${en.selected_course.replace(/"/g, '""')}"`,
        `"${en.experience_level}"`,
        `"${en.preferred_batch}"`,
        `"${en.status}"`,
        `"${new Date(en.created_at).toLocaleDateString()}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Leveluxe_Enrollments_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row relative overflow-hidden">
      {/* Sidebar background ambient glow */}
      <div className="absolute top-[20%] left-[-10%] w-[300px] h-[300px] rounded-full bg-yellow-500/5 blur-[100px] -z-10" />

      {/* --- Sidebar Navigation --- */}
      <aside className="w-full md:w-64 bg-neutral-900 border-r border-neutral-850 flex flex-col flex-shrink-0 relative z-20">
        {/* Brand Header */}
        <div className="p-6 border-b border-neutral-850 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Music4 className="h-6 w-6 text-yellow-500" />
            <span className="font-black text-lg tracking-wider text-white">LEVELUXE <span className="text-[10px] text-yellow-500 tracking-normal block font-normal -mt-1 uppercase">Operations</span></span>
          </div>
        </div>

        {/* Navigation Tab Links */}
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'enrollments', label: 'Enrollments', icon: ClipboardList },
            { id: 'users', label: 'User Grid', icon: UserCheck },
            { id: 'courses', label: 'Courses', icon: BookOpen },
            { id: 'instructors', label: 'Coaches', icon: Users },
            { id: 'schedules', label: 'Schedules', icon: Calendar },
            { id: 'audit', label: 'Audit Logs', icon: History },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center space-x-3 py-3 px-4 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  isSelected 
                    ? 'bg-yellow-500 text-neutral-900 shadow-lg shadow-yellow-500/10' 
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-neutral-850">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 py-3 px-4 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all text-left cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Revoke Access</span>
          </button>
        </div>
      </aside>

      {/* --- Main Dashboard Area --- */}
      <main className="flex-grow flex flex-col min-h-screen relative z-10 pt-20 md:pt-0">
        
        {/* Top Operations Header */}
        <header className="bg-neutral-900/60 border-b border-neutral-850/80 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md sticky top-0 z-30">
          <div>
            <span className="text-[10px] text-yellow-500 uppercase tracking-widest font-black bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">Secure Area</span>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1.5 capitalize">{activeTab} Workspace</h1>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Quick Action triggers based on context */}
            {activeTab === 'courses' && (
              <button 
                onClick={() => { setCourseForm({ id: 0, title: '', instrument: '', level: 'Beginner', duration: '', fees: 0, description: '', image_url: '' }); setIsCourseFormOpen(true); }}
                className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold py-2.5 px-5 rounded-xl text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Program
              </button>
            )}
            {activeTab === 'instructors' && (
              <button 
                onClick={() => { setInstructorForm({ id: 0, full_name: '', instrument: '', qualification: '', experience_years: 0, bio: '', languages: '', specialization: '', image_url: '' }); setIsInstructorFormOpen(true); }}
                className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold py-2.5 px-5 rounded-xl text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Coach
              </button>
            )}
            {activeTab === 'schedules' && (
              <button 
                onClick={() => { setScheduleForm({ id: 0, course_name: '', instructor: '', day: 'Monday', start_time: '', end_time: '', batch: 'Morning Batch', level: 'Beginner', room: '', available_seats: 10 }); setIsScheduleFormOpen(true); }}
                className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold py-2.5 px-5 rounded-xl text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Class Slot
              </button>
            )}
            
            {/* Active Admin Details */}
            <div className="bg-neutral-950 border border-neutral-850 px-4 py-2 rounded-xl text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-neutral-350">{currentAdmin?.full_name}</span>
            </div>
          </div>
        </header>

        {/* --- Content Body --- */}
        <div className="flex-grow p-6 sm:p-8 overflow-y-auto">
          
          {/* Notifications Alert panels */}
          {alertSuccess && (
            <div className="bg-emerald-950/20 border border-emerald-900/50 text-emerald-450 p-4 rounded-2xl flex items-center gap-3 text-xs mb-6 max-w-2xl">
              <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              <p>{alertSuccess}</p>
            </div>
          )}
          {alertError && (
            <div className="bg-red-950/20 border border-red-900/50 text-red-400 p-4 rounded-2xl flex items-center gap-3 text-xs mb-6 max-w-2xl">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p>{alertError}</p>
            </div>
          )}

          {isLoading ? (
            <div className="py-28 text-center flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-yellow-500" />
              <p className="text-xs text-neutral-450 tracking-wider">Syncing database registers...</p>
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Tab 1: Dashboard Analytics */}
              {activeTab === 'dashboard' && analytics && (
                <div className="space-y-8">
                  {/* Dashboard metrics widgets */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {[
                      { label: 'Active Students', value: analytics.total_students, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                      { label: 'Total Programs', value: analytics.total_courses, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                      { label: 'Academy Coaches', value: analytics.total_instructors, color: 'text-emerald-450', bg: 'bg-emerald-500/10' },
                      { label: 'Total Registrations', value: analytics.total_enrollments, color: 'text-rose-400', bg: 'bg-rose-500/10' },
                      { label: 'Pending Review', value: analytics.pending_enrollments, color: 'text-yellow-500', bg: 'bg-yellow-500/10' }
                    ].map((stat, idx) => (
                      <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-lg flex flex-col justify-between space-y-3 relative overflow-hidden">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] text-neutral-450 font-bold uppercase tracking-wider">{stat.label}</span>
                          <span className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                            <LayoutDashboard className="h-4 w-4" />
                          </span>
                        </div>
                        <h4 className="text-3xl font-black text-white">{stat.value}</h4>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Today's Classes List */}
                    <div className="lg:col-span-1 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
                      <h3 className="text-base font-extrabold tracking-tight flex items-center gap-2">
                        <Calendar className="h-4.5 w-4.5 text-yellow-500" />
                        Today's Scheduled Classes
                      </h3>
                      {analytics.today_classes.length === 0 ? (
                        <p className="text-neutral-500 text-xs py-8 text-center">No active class slots scheduled for today.</p>
                      ) : (
                        <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                          {analytics.today_classes.map((cls) => (
                            <div key={cls.id} className="bg-neutral-950 border border-neutral-850 p-4 rounded-2xl text-xs space-y-2">
                              <h4 className="font-extrabold text-white">{cls.course_name}</h4>
                              <div className="flex flex-wrap justify-between items-center text-[10px] text-neutral-450 gap-2">
                                <span>Coached by {cls.instructor}</span>
                                <span>{cls.start_time} - {cls.end_time}</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px] border-t border-neutral-850 pt-2 text-neutral-500">
                                <span>Classroom: {cls.room}</span>
                                <span className="bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded font-bold uppercase">{cls.batch}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Recent Bookings Queue */}
                    <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
                      <h3 className="text-base font-extrabold tracking-tight flex items-center gap-2">
                        <ClipboardList className="h-4.5 w-4.5 text-yellow-500" />
                        Recent Registrations Queue
                      </h3>
                      {analytics.recent_enrollments.length === 0 ? (
                        <p className="text-neutral-500 text-xs py-12 text-center">No registrations booked.</p>
                      ) : (
                        <div className="overflow-x-auto text-xs">
                          <table className="w-full text-left divide-y divide-neutral-800">
                            <thead>
                              <tr className="text-neutral-450 font-bold uppercase tracking-wider text-[10px]">
                                <th className="pb-3 pl-3">Student</th>
                                <th className="pb-3">Program</th>
                                <th className="pb-3">Preferred Batch</th>
                                <th className="pb-3 pr-3 text-right">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/50">
                              {analytics.recent_enrollments.map((en) => (
                                <tr key={en.id} className="hover:bg-white/5 transition-colors">
                                  <td className="py-3 pl-3 font-bold text-white">{en.full_name}</td>
                                  <td className="py-3 text-neutral-300">{en.selected_course}</td>
                                  <td className="py-3 text-neutral-450">{en.preferred_batch}</td>
                                  <td className="py-3 pr-3 text-right">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                      en.status.toLowerCase() === 'approved' 
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                                        : en.status.toLowerCase() === 'rejected'
                                        ? 'bg-red-500/10 text-red-400 border border-red-500/25'
                                        : 'bg-yellow-500/10 text-yellow-450 border border-yellow-500/25'
                                    }`}>
                                      {en.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* Tab 2: Enrollments management */}
              {activeTab === 'enrollments' && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-md space-y-6">
                  {/* Search filters */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                      <div className="relative flex-1 sm:w-72">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-550">
                          <Search className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          placeholder="Search student, course, details..."
                          value={enrollmentSearch}
                          onChange={(e) => setEnrollmentSearch(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none placeholder-neutral-600 transition-colors"
                        />
                      </div>
                      
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                          <Filter className="h-3.5 w-3.5" />
                        </span>
                        <select
                          value={enrollmentFilter}
                          onChange={(e) => setEnrollmentFilter(e.target.value)}
                          className="bg-neutral-950 border border-neutral-800 text-xs rounded-xl pl-9 pr-6 py-2.5 text-white focus:outline-none focus:border-yellow-500 cursor-pointer"
                        >
                          {['All', 'Pending', 'Approved', 'Rejected'].map(st => (
                            <option key={st} value={st}>{st} Bookings</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button 
                      onClick={exportEnrollmentsCSV}
                      className="w-full sm:w-auto bg-neutral-800 hover:bg-neutral-750 text-neutral-300 font-bold py-2.5 px-4 rounded-xl text-xs border border-neutral-700 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                    >
                      <Download className="h-4 w-4" /> Export CSV
                    </button>
                  </div>

                  {/* Enrollments Table */}
                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left divide-y divide-neutral-800">
                      <thead>
                        <tr className="text-neutral-450 font-bold uppercase tracking-wider text-[10px]">
                          <th className="pb-3 pl-3">Student Info</th>
                          <th className="pb-3">Program Details</th>
                          <th className="pb-3">Batch Info</th>
                          <th className="pb-3">Verification</th>
                          <th className="pb-3 pr-3 text-right">Approve / Reject Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/60">
                        {enrollments
                          .filter(en => {
                            const matchSearch = en.full_name.toLowerCase().includes(enrollmentSearch.toLowerCase()) || 
                                                en.email.toLowerCase().includes(enrollmentSearch.toLowerCase()) ||
                                                en.selected_course.toLowerCase().includes(enrollmentSearch.toLowerCase());
                            const matchFilter = enrollmentFilter === 'All' || en.status === enrollmentFilter;
                            return matchSearch && matchFilter;
                          })
                          .map((en) => (
                            <tr key={en.id} className="hover:bg-white/5 transition-colors">
                              <td className="py-3.5 pl-3">
                                <span className="font-bold text-white text-sm">{en.full_name}</span> <br />
                                <span className="text-[10px] text-neutral-400">{en.email} • {en.phone}</span>
                              </td>
                              <td className="py-3.5 font-bold text-neutral-300">
                                {en.selected_course} <br />
                                <span className="text-[10px] text-neutral-500 font-normal">Level: {en.experience_level} • Age: {en.age}</span>
                              </td>
                              <td className="py-3.5 text-neutral-400">
                                {en.preferred_batch} <br />
                                <span className="text-[9px] text-neutral-500">Booked: {new Date(en.created_at).toLocaleDateString()}</span>
                              </td>
                              <td className="py-3.5">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  en.status.toLowerCase() === 'approved' 
                                    ? 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/25'
                                    : en.status.toLowerCase() === 'rejected'
                                    ? 'bg-red-500/10 text-red-400 border border-red-500/25'
                                    : 'bg-yellow-500/10 text-yellow-450 border border-yellow-500/25'
                                }`}>
                                  {en.status}
                                </span>
                              </td>
                              <td className="py-3.5 pr-3 text-right space-x-1.5">
                                {en.status.toLowerCase() === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleUpdateEnrollment(en.id, 'Approved')}
                                      className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 p-1.5 rounded-lg border border-emerald-500/20 transition-all cursor-pointer inline-flex items-center"
                                      title="Approve booking"
                                    >
                                      <Check className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleUpdateEnrollment(en.id, 'Rejected')}
                                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-1.5 rounded-lg border border-red-500/20 transition-all cursor-pointer inline-flex items-center"
                                      title="Reject booking"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => handleCancelEnrollment(en.id)}
                                  className="text-neutral-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all cursor-pointer inline-flex items-center"
                                  title="Cancel booking"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 3: Users Grid */}
              {activeTab === 'users' && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-md space-y-6">
                  {/* Search users */}
                  <div className="relative w-full sm:w-72">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-550">
                      <Search className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Search accounts name or email..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none placeholder-neutral-600 transition-colors"
                    />
                  </div>

                  {/* Users Table */}
                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left divide-y divide-neutral-800">
                      <thead>
                        <tr className="text-neutral-450 font-bold uppercase tracking-wider text-[10px]">
                          <th className="pb-3 pl-3">Full Name</th>
                          <th className="pb-3">Email Address</th>
                          <th className="pb-3">Role</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 pr-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/60">
                        {users
                          .filter(u => u.full_name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
                          .map((u) => (
                            <tr key={u.id} className="hover:bg-white/5 transition-colors">
                              <td className="py-3.5 pl-3 font-bold text-white text-sm">{u.full_name}</td>
                              <td className="py-3.5 text-neutral-350">{u.email}</td>
                              <td className="py-3.5">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  u.role.toLowerCase() === 'admin' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-neutral-950 text-neutral-400 border border-neutral-800'
                                }`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="py-3.5">
                                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${u.is_active ? 'text-emerald-450' : 'text-neutral-550'}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-500'}`} />
                                  {u.is_active ? 'Active' : 'Suspended'}
                                </span>
                              </td>
                              <td className="py-3.5 pr-3 text-right space-x-1">
                                <button 
                                  onClick={() => handleViewUserHistory(u)}
                                  className="bg-white/5 border border-white/10 text-white font-semibold py-1.5 px-2.5 rounded-lg text-[10px] transition-all cursor-pointer hover:bg-white/10"
                                  title="View student registrations history"
                                >
                                  History
                                </button>
                                <button 
                                  onClick={() => { setUserForm({ id: u.id, role: u.role, is_active: u.is_active }); setIsUserFormOpen(true); }}
                                  className="text-neutral-450 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer inline-flex items-center"
                                  title="Update role or status"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => { setUserResetPwForm({ id: u.id, email: u.email, new_password: '' }); setIsResetPwOpen(true); }}
                                  className="text-neutral-450 hover:text-yellow-500 p-1.5 rounded-lg hover:bg-yellow-500/10 transition-all cursor-pointer inline-flex items-center"
                                  title="Reset password"
                                >
                                  <Key className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="text-neutral-550 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all cursor-pointer inline-flex items-center"
                                  title="Delete user"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 4: Courses list */}
              {activeTab === 'courses' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((c) => (
                    <div key={c.id} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="font-extrabold text-white text-base sm:text-lg">{c.title}</h4>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 px-2.5 py-0.5 rounded text-neutral-450">
                            {c.instrument}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-450 line-clamp-3 leading-relaxed">{c.description}</p>
                        <div className="pt-2 flex justify-between text-xs font-semibold text-neutral-350">
                          <span>Duration: {c.duration}</span>
                          <span className="text-yellow-500 font-bold">Fees: ₹{c.fees}</span>
                        </div>
                        <div className="pt-2 text-[10px] text-neutral-500 flex justify-between">
                          <span>Difficulty: {c.level}</span>
                          <span className="bg-emerald-500/15 text-emerald-450 px-2 py-0.5 rounded font-extrabold tracking-wide uppercase">Active</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 border-t border-neutral-805 pt-3 text-xs">
                        <button 
                          onClick={() => { setCourseForm({ id: c.id, title: c.title, instrument: c.instrument, level: c.level, duration: c.duration, fees: c.fees, description: c.description, image_url: c.image_url }); setIsCourseFormOpen(true); }}
                          className="bg-white/5 hover:bg-white/10 text-white font-semibold py-1.5 px-3 rounded-lg border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteCourse(c.id)}
                          className="bg-red-500/10 hover:bg-red-500/15 text-red-400 font-semibold py-1.5 px-3 rounded-lg border border-red-500/10 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 5: Coaches list */}
              {activeTab === 'instructors' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {instructors.map((i) => (
                    <div key={i.id} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="font-extrabold text-white text-base sm:text-lg">{i.full_name}</h4>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded text-indigo-400">
                            {i.instrument}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-300 font-semibold">{i.qualification}</p>
                        <p className="text-[11px] text-neutral-450 line-clamp-3 leading-relaxed">{i.bio}</p>
                        <div className="pt-2 text-xs text-neutral-400 flex justify-between">
                          <span>Experience: {i.experience_years} Years</span>
                          <span>Languages: {i.languages}</span>
                        </div>
                        <div className="pt-2 text-[10px] text-neutral-500 flex justify-between">
                          <span>Specialization: {i.specialization}</span>
                          <span className="bg-emerald-500/10 text-emerald-450 px-2 py-0.5 rounded uppercase font-bold">Enabled</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 border-t border-neutral-805 pt-3 text-xs">
                        <button 
                          onClick={() => { setInstructorForm({ id: i.id, full_name: i.full_name, instrument: i.instrument, qualification: i.qualification, experience_years: i.experience_years, bio: i.bio, languages: i.languages, specialization: i.specialization, image_url: i.image_url }); setIsInstructorFormOpen(true); }}
                          className="bg-white/5 hover:bg-white/10 text-white font-semibold py-1.5 px-3 rounded-lg border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteInstructor(i.id)}
                          className="bg-red-500/10 hover:bg-red-500/15 text-red-400 font-semibold py-1.5 px-3 rounded-lg border border-red-500/10 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 6: Schedules planner */}
              {activeTab === 'schedules' && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-md space-y-6">
                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left divide-y divide-neutral-800">
                      <thead>
                        <tr className="text-neutral-450 font-bold uppercase tracking-wider text-[10px]">
                          <th className="pb-3 pl-3">Course Name</th>
                          <th className="pb-3">Day / Time Slot</th>
                          <th className="pb-3">Class Level / batch</th>
                          <th className="pb-3">Instructor</th>
                          <th className="pb-3">Classroom / Capacity</th>
                          <th className="pb-3 pr-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/60">
                        {schedules.map((s) => (
                          <tr key={s.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-3.5 pl-3 font-bold text-white text-sm">{s.course_name}</td>
                            <td className="py-3.5 text-neutral-300">
                              {s.day} <br />
                              <span className="text-xs text-neutral-450">{s.start_time} - {s.end_time}</span>
                            </td>
                            <td className="py-3.5 text-neutral-355">
                              {s.batch} <br />
                              <span className="text-xs text-neutral-500">{s.level}</span>
                            </td>
                            <td className="py-3.5 text-neutral-300 font-medium">{s.instructor}</td>
                            <td className="py-3.5 text-neutral-450">
                              {s.room} • {s.available_seats} Capacity
                            </td>
                            <td className="py-3.5 pr-3 text-right space-x-1.5">
                              <button 
                                onClick={() => { setScheduleForm({ id: s.id, course_name: s.course_name, instructor: s.instructor, day: s.day, start_time: s.start_time, end_time: s.end_time, batch: s.batch, level: s.level, room: s.room, available_seats: s.available_seats }); setIsScheduleFormOpen(true); }}
                                className="text-neutral-450 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer inline-flex items-center"
                                title="Edit slot details"
                              >
                               <Edit2 className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteSchedule(s.id)}
                                className="text-neutral-550 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all cursor-pointer inline-flex items-center"
                                title="Delete slot"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 7: Audit Logs */}
              {activeTab === 'audit' && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-md space-y-6">
                  {/* Search filter panels */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative flex-1 sm:w-72">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-550">
                        <Search className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="Search by action (e.g. Created)..."
                        value={auditSearch}
                        onChange={(e) => setAuditSearch(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none placeholder-neutral-600 transition-colors"
                      />
                    </div>

                    <div className="relative flex-1 sm:w-72">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-550">
                        <Filter className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="Search by resource email/name..."
                        value={auditResourceSearch}
                        onChange={(e) => setAuditResourceSearch(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none placeholder-neutral-600 transition-colors"
                      />
                    </div>

                    <button 
                      onClick={loadData}
                      className="bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold py-2.5 px-5 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Refresh Logs
                    </button>
                  </div>

                  {/* Audit Logs Table */}
                  <div className="overflow-x-auto text-[11px]">
                    {auditLogs.length === 0 ? (
                      <p className="text-neutral-500 text-xs py-8 text-center">No logs matching criteria.</p>
                    ) : (
                      <table className="w-full text-left divide-y divide-neutral-800">
                        <thead>
                          <tr className="text-neutral-450 font-bold uppercase tracking-wider text-[10px]">
                            <th className="pb-3 pl-3">Timestamp</th>
                            <th className="pb-3">Admin</th>
                            <th className="pb-3">Action</th>
                            <th className="pb-3">Affected Resource</th>
                            <th className="pb-3">Network Info</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/60">
                          {auditLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-white/5 transition-colors">
                              <td className="py-3 pl-3 text-neutral-500">
                                {new Date(log.timestamp).toLocaleString()}
                              </td>
                              <td className="py-3 font-bold text-white">{log.admin_name}</td>
                              <td className="py-3 text-yellow-500 font-semibold">{log.action}</td>
                              <td className="py-3 text-neutral-300 max-w-xs truncate" title={log.resource}>{log.resource}</td>
                              <td className="py-3 text-neutral-450" title={log.user_agent || ''}>
                                <div className="flex items-center gap-1.5">
                                  <Globe className="h-3 w-3 text-neutral-500" />
                                  <span>{log.ip_address || 'Localhost'}</span>
                                </div>
                                <span className="text-[9px] text-neutral-550 block max-w-xs truncate">{log.user_agent}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 8: Settings Change Password */}
              {activeTab === 'settings' && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-md max-w-xl space-y-6">
                  <h3 className="text-base font-extrabold tracking-tight flex items-center gap-2">
                    <Key className="h-4.5 w-4.5 text-yellow-500" />
                    Modify Account Access Password
                  </h3>
                  
                  <form onSubmit={handleAdminChangePasswordSubmit} className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-bold text-neutral-400 uppercase tracking-wider">Current Admin Password</label>
                      <input
                        type="password"
                        value={adminChangePw.old_password}
                        onChange={(e) => setAdminChangePw({...adminChangePw, old_password: e.target.value})}
                        className="w-full bg-neutral-950 border border-neutral-850 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-bold text-neutral-400 uppercase tracking-wider">New Password</label>
                        <input
                          type="password"
                          value={adminChangePw.new_password}
                          onChange={(e) => setAdminChangePw({...adminChangePw, new_password: e.target.value})}
                          className="w-full bg-neutral-950 border border-neutral-850 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none"
                          required
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="font-bold text-neutral-400 uppercase tracking-wider">Confirm New Password</label>
                        <input
                          type="password"
                          value={adminChangePw.confirm_password}
                          onChange={(e) => setAdminChangePw({...adminChangePw, confirm_password: e.target.value})}
                          className="w-full bg-neutral-950 border border-neutral-850 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold px-6 py-3 rounded-xl transition-all active:scale-95 text-xs cursor-pointer"
                    >
                      Update Admin Password
                    </button>
                  </form>
                </div>
              )}

            </div>
          )}
        </div>

      </main>

      {/* --- SIDEBAR MODAL FORMS --- */}

      {/* Course Modal */}
      {isCourseFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-md space-y-4 text-white text-xs">
            <h3 className="text-lg font-bold text-white">{courseForm.id > 0 ? 'Edit Course Details' : 'Add New Course'}</h3>
            <form onSubmit={handleCourseSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">Course Title</label>
                <input 
                  type="text" placeholder="e.g. Guitar Masterclass" value={courseForm.title} onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">Instrument Category</label>
                <input 
                  type="text" placeholder="e.g. Guitar" value={courseForm.instrument} onChange={(e) => setCourseForm({...courseForm, instrument: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">Difficulty level</label>
                  <select value={courseForm.level} onChange={(e) => setCourseForm({...courseForm, level: e.target.value})}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none cursor-pointer">
                    {['Beginner', 'Intermediate', 'Advanced'].map(lvl => <option key={lvl} value={lvl} className="bg-neutral-900">{lvl}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">Duration weeks</label>
                  <input 
                    type="text" placeholder="e.g. 24 Weeks" value={courseForm.duration} onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">Tuition Fee (₹)</label>
                <input 
                  type="number" placeholder="Tuition Fee (₹)" value={courseForm.fees || ''} onChange={(e) => setCourseForm({...courseForm, fees: Number(e.target.value)})}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">Course Description</label>
                <textarea 
                  placeholder="Syllabus layout details..." rows={3} value={courseForm.description} onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none resize-none" required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsCourseFormOpen(false)} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer">Cancel</button>
                <button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Instructor Modal */}
      {isInstructorFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-md space-y-4 text-white text-xs">
            <h3 className="text-lg font-bold">{instructorForm.id > 0 ? 'Edit Instructor Profile' : 'Add New Instructor'}</h3>
            <form onSubmit={handleInstructorSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">Full Name</label>
                <input 
                  type="text" placeholder="Arjun Rao" value={instructorForm.full_name} onChange={(e) => setInstructorForm({...instructorForm, full_name: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">Core Instrument Specialty</label>
                <input 
                  type="text" placeholder="e.g. Drums" value={instructorForm.instrument} onChange={(e) => setInstructorForm({...instructorForm, instrument: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">Qualification Degrees</label>
                <input 
                  type="text" placeholder="e.g. Grade 8 Rockschool" value={instructorForm.qualification} onChange={(e) => setInstructorForm({...instructorForm, qualification: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">Experience (Years)</label>
                  <input 
                    type="number" placeholder="Experience" value={instructorForm.experience_years || ''} onChange={(e) => setInstructorForm({...instructorForm, experience_years: Number(e.target.value)})}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">Languages Spoken</label>
                  <input 
                    type="text" placeholder="English, Telugu" value={instructorForm.languages} onChange={(e) => setInstructorForm({...instructorForm, languages: e.target.value})}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">Specialization Focus</label>
                <input 
                  type="text" placeholder="e.g. Classical Repertoire" value={instructorForm.specialization} onChange={(e) => setInstructorForm({...instructorForm, specialization: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">Biography Description</label>
                <textarea 
                  placeholder="Bio info details..." rows={3} value={instructorForm.bio} onChange={(e) => setInstructorForm({...instructorForm, bio: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none resize-none" required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsInstructorFormOpen(false)} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer">Cancel</button>
                <button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer">Save Coach</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {isScheduleFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-md space-y-4 text-white text-xs">
            <h3 className="text-lg font-bold">{scheduleForm.id > 0 ? 'Edit Schedule Slot' : 'Add New Schedule Slot'}</h3>
            <form onSubmit={handleScheduleSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">Course Title</label>
                <input 
                  type="text" placeholder="Guitar (Acoustic & Electric)" value={scheduleForm.course_name} onChange={(e) => setScheduleForm({...scheduleForm, course_name: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">Assigned Coach</label>
                <input 
                  type="text" placeholder="Arjun Rao" value={scheduleForm.instructor} onChange={(e) => setScheduleForm({...scheduleForm, instructor: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">Weekly Day</label>
                  <select value={scheduleForm.day} onChange={(e) => setScheduleForm({...scheduleForm, day: e.target.value})}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none cursor-pointer">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => <option key={d} value={d} className="bg-neutral-900">{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">Timing Batch</label>
                  <select value={scheduleForm.batch} onChange={(e) => setScheduleForm({...scheduleForm, batch: e.target.value})}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none cursor-pointer">
                    {['Morning Batch', 'Afternoon Batch', 'Evening Batch'].map(b => <option key={b} value={b} className="bg-neutral-900">{b}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">Start Time</label>
                  <input 
                    type="text" placeholder="e.g. 09:00 AM" value={scheduleForm.start_time} onChange={(e) => setScheduleForm({...scheduleForm, start_time: e.target.value})}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">End Time</label>
                  <input 
                    type="text" placeholder="e.g. 10:30 AM" value={scheduleForm.end_time} onChange={(e) => setScheduleForm({...scheduleForm, end_time: e.target.value})}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">Difficulty</label>
                  <select value={scheduleForm.level} onChange={(e) => setScheduleForm({...scheduleForm, level: e.target.value})}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-3 text-xs focus:outline-none cursor-pointer">
                    {['Beginner', 'Intermediate', 'Advanced'].map(lvl => <option key={lvl} value={lvl} className="bg-neutral-900">{lvl}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">Classroom</label>
                  <input 
                    type="text" placeholder="Room A" value={scheduleForm.room} onChange={(e) => setScheduleForm({...scheduleForm, room: e.target.value})}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-3 py-3 text-sm focus:outline-none" required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">Capacity</label>
                  <input 
                    type="number" placeholder="Seats" value={scheduleForm.available_seats || ''} onChange={(e) => setScheduleForm({...scheduleForm, available_seats: Number(e.target.value)})}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-3 py-3 text-sm focus:outline-none" required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsScheduleFormOpen(false)} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer">Cancel</button>
                <button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer">Save Slot</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Update Modal */}
      {isUserFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-sm space-y-4 text-white text-xs">
            <h3 className="text-lg font-bold">Edit Account Privileges</h3>
            <form onSubmit={handleUserUpdateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">System Role</label>
                <select 
                  value={userForm.role} 
                  onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none cursor-pointer"
                >
                  <option value="Student" className="bg-neutral-900">Student</option>
                  <option value="Admin" className="bg-neutral-900">Admin</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Access status</label>
                <select 
                  value={userForm.is_active ? 'true' : 'false'} 
                  onChange={(e) => setUserForm({...userForm, is_active: e.target.value === 'true'})}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none cursor-pointer"
                >
                  <option value="true" className="bg-neutral-900">Active (Access Allowed)</option>
                  <option value="false" className="bg-neutral-900">Suspended (Access Revoked)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsUserFormOpen(false)} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer">Cancel</button>
                <button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer">Save Privileges</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Password Reset Modal */}
      {isResetPwOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-sm space-y-4 text-white text-xs">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Key className="h-5 w-5 text-yellow-500" />
              Reset Student Password
            </h3>
            <p className="text-neutral-450 leading-relaxed text-[11px]">
              Set a temporary password for <strong>{userResetPwForm.email}</strong>. They will use this password on their next login.
            </p>
            <form onSubmit={handleUserPasswordReset} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Temporary Password *</label>
                <input 
                  type="password" placeholder="••••••••" value={userResetPwForm.new_password} onChange={(e) => setUserResetPwForm({...userResetPwForm, new_password: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsResetPwOpen(false)} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer">Cancel</button>
                <button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer">Override Password</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User History Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-lg space-y-4 text-white text-xs max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-neutral-850 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Enrollments History</h3>
                <p className="text-neutral-450 text-[10px]">{historyUserEmail}</p>
              </div>
              <button 
                onClick={() => setIsHistoryOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-white/5 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto space-y-3 py-3 pr-1">
              {selectedUserHistory.length === 0 ? (
                <p className="text-neutral-500 py-8 text-center">No registration records found for this student.</p>
              ) : (
                selectedUserHistory.map((h) => (
                  <div key={h.id} className="bg-neutral-950 border border-neutral-850 p-4 rounded-2xl flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-extrabold text-white text-sm">{h.selected_course}</h4>
                      <p className="text-[10px] text-neutral-500 mt-1">
                        Batch: {h.preferred_batch} • Booked: {new Date(h.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      h.status.toLowerCase() === 'approved' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                        : h.status.toLowerCase() === 'rejected'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/25'
                        : 'bg-yellow-500/10 text-yellow-450 border border-yellow-500/25'
                    }`}>
                      {h.status}
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="pt-3 border-t border-neutral-850 flex justify-end">
              <button onClick={() => setIsHistoryOpen(false)} className="bg-white/5 border border-white/10 px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
