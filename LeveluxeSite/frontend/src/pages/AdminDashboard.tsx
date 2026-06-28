import React, { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';
import { 
  Check, X, Loader2, Plus, Edit2, Trash2, BarChart2, 
  CheckCircle, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- Interfaces ---
interface UserResponse {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  role: string;
  is_active: boolean;
  is_verified: boolean;
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

interface Analytics {
  total_students: number;
  total_courses: number;
  total_instructors: number;
  total_enrollments: number;
  recent_enrollments: Array<{
    id: number;
    full_name: string;
    selected_course: string;
    preferred_batch: string;
    created_at: string;
  }>;
}

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'courses' | 'instructors' | 'schedule' | 'enrollments'>('analytics');
  
  // Data lists
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [instructors, setInstructors] = useState<InstructorResponse[]>([]);
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentResponse[]>([]);
  
  // Loading & Feedback
  const [isLoading, setIsLoading] = useState(true);
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);
  const [alertError, setAlertError] = useState<string | null>(null);

  // Form Modals states
  const [courseForm, setCourseForm] = useState({ id: 0, title: '', instrument: '', level: 'Beginner', duration: '', fees: 0, description: '', image_url: '' });
  const [isCourseFormOpen, setIsCourseFormOpen] = useState(false);

  const [instructorForm, setInstructorForm] = useState({ id: 0, full_name: '', instrument: '', qualification: '', experience_years: 0, bio: '', languages: '', specialization: '', image_url: '' });
  const [isInstructorFormOpen, setIsInstructorFormOpen] = useState(false);

  const [scheduleForm, setScheduleForm] = useState({ id: 0, course_name: '', instructor: '', day: 'Monday', start_time: '', end_time: '', batch: 'Morning Batch', level: 'Beginner', room: '', available_seats: 10 });
  const [isScheduleFormOpen, setIsScheduleFormOpen] = useState(false);

  const [userForm, setUserForm] = useState({ id: 0, role: '', is_active: true });
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);

  // Initial Fetcher
  const fetchData = async () => {
    setIsLoading(true);
    setAlertSuccess(null);
    setAlertError(null);
    try {
      if (activeTab === 'analytics') {
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
      } else if (activeTab === 'schedule') {
        const res = await apiClient.get<ScheduleResponse[]>('/schedule');
        setSchedules(res.data);
      } else if (activeTab === 'enrollments') {
        const res = await apiClient.get<EnrollmentResponse[]>('/enrollments');
        setEnrollments(res.data);
      }
    } catch (err: any) {
      setAlertError('Failed to retrieve control board data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const showFeedback = (successMsg: string | null, errorMsg: string | null = null) => {
    setAlertSuccess(successMsg);
    setAlertError(errorMsg);
    setTimeout(() => {
      setAlertSuccess(null);
      setAlertError(null);
    }, 4000);
  };

  // --- Enrollment Approvals handlers ---
  const handleUpdateEnrollment = async (id: number, status: 'Approved' | 'Rejected') => {
    try {
      await apiClient.put(`/enrollments/${id}`, { status });
      showFeedback(`Enrollment request ${status.toLowerCase()} successfully.`);
      fetchData();
    } catch (err: any) {
      showFeedback(null, 'Failed to update enrollment status.');
    }
  };

  const handleDeleteEnrollment = async (id: number) => {
    if (!confirm('Are you sure you want to delete this enrollment record?')) return;
    try {
      await apiClient.delete(`/enrollments/${id}`);
      showFeedback('Enrollment deleted successfully.');
      fetchData();
    } catch (err: any) {
      showFeedback(null, 'Failed to delete enrollment.');
    }
  };

  // --- User Management handlers ---
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.put(`/admin/users/${userForm.id}`, {
        role: userForm.role,
        is_active: userForm.is_active
      });
      setIsUserFormOpen(false);
      showFeedback('User profile updated successfully.');
      fetchData();
    } catch (err: any) {
      showFeedback(null, 'Failed to update user roles.');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user account?')) return;
    try {
      await apiClient.delete(`/admin/users/${id}`);
      showFeedback('User deleted successfully.');
      fetchData();
    } catch (err: any) {
      showFeedback(null, 'Failed to delete user.');
    }
  };

  // --- Course handlers ---
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
        await apiClient.put(`/courses/${courseForm.id}`, payload);
        showFeedback('Course details updated.');
      } else {
        await apiClient.post('/courses', payload);
        showFeedback('New course successfully registered.');
      }
      setIsCourseFormOpen(false);
      fetchData();
    } catch (err: any) {
      showFeedback(null, 'Course operation failed.');
    }
  };

  const handleDeleteCourse = async (id: number) => {
    if (!confirm('Delete this course?')) return;
    try {
      await apiClient.delete(`/courses/${id}`);
      showFeedback('Course deleted successfully.');
      fetchData();
    } catch (err: any) {
      showFeedback(null, 'Failed to delete course.');
    }
  };

  // --- Instructor handlers ---
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
        await apiClient.put(`/instructors/${instructorForm.id}`, payload);
        showFeedback('Instructor profile updated.');
      } else {
        await apiClient.post('/instructors', payload);
        showFeedback('Instructor registered successfully.');
      }
      setIsInstructorFormOpen(false);
      fetchData();
    } catch (err: any) {
      showFeedback(null, 'Instructor operation failed.');
    }
  };

  const handleDeleteInstructor = async (id: number) => {
    if (!confirm('Delete this instructor?')) return;
    try {
      await apiClient.delete(`/instructors/${id}`);
      showFeedback('Instructor profile deleted.');
      fetchData();
    } catch (err: any) {
      showFeedback(null, 'Failed to delete instructor.');
    }
  };

  // --- Schedule handlers ---
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
        await apiClient.put(`/schedule/${scheduleForm.id}`, payload);
        showFeedback('Schedule slot updated.');
      } else {
        await apiClient.post('/schedule', payload);
        showFeedback('New schedule slot registered.');
      }
      setIsScheduleFormOpen(false);
      fetchData();
    } catch (err: any) {
      showFeedback(null, 'Schedule operation failed.');
    }
  };

  const handleDeleteSchedule = async (id: number) => {
    if (!confirm('Delete this schedule slot?')) return;
    try {
      await apiClient.delete(`/schedule/${id}`);
      showFeedback('Schedule slot deleted.');
      fetchData();
    } catch (err: any) {
      showFeedback(null, 'Failed to delete schedule slot.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Glow Effects */}
      <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-neutral-900 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Admin Operations Board</h1>
            <p className="text-neutral-450 text-xs sm:text-sm mt-1">Supervise academy bookings, courses, and schedules</p>
          </div>
          
          {/* Main Action buttons based on active tab */}
          <div>
            {activeTab === 'courses' && (
              <button 
                onClick={() => { setCourseForm({ id: 0, title: '', instrument: '', level: 'Beginner', duration: '', fees: 0, description: '', image_url: '' }); setIsCourseFormOpen(true); }}
                className="bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold py-2.5 px-5 rounded-xl text-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-yellow-500/10"
              >
                <Plus className="h-4.5 w-4.5" /> Add Course
              </button>
            )}
            {activeTab === 'instructors' && (
              <button 
                onClick={() => { setInstructorForm({ id: 0, full_name: '', instrument: '', qualification: '', experience_years: 0, bio: '', languages: '', specialization: '', image_url: '' }); setIsInstructorFormOpen(true); }}
                className="bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold py-2.5 px-5 rounded-xl text-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-yellow-500/10"
              >
                <Plus className="h-4.5 w-4.5" /> Add Instructor
              </button>
            )}
            {activeTab === 'schedule' && (
              <button 
                onClick={() => { setScheduleForm({ id: 0, course_name: '', instructor: '', day: 'Monday', start_time: '', end_time: '', batch: 'Morning Batch', level: 'Beginner', room: '', available_seats: 10 }); setIsScheduleFormOpen(true); }}
                className="bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold py-2.5 px-5 rounded-xl text-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-yellow-500/10"
              >
                <Plus className="h-4.5 w-4.5" /> Add Schedule Slot
              </button>
            )}
          </div>
        </div>

        {/* Global Feedback Notifications */}
        {alertSuccess && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-950/30 border border-emerald-900/50 text-emerald-450 rounded-xl p-4 flex items-center space-x-3 text-xs">
            <CheckCircle className="h-4.5 w-4.5 text-emerald-450" />
            <p>{alertSuccess}</p>
          </motion.div>
        )}
        {alertError && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-950/30 border border-red-900/50 text-red-450 rounded-xl p-4 flex items-center space-x-3 text-xs">
            <AlertCircle className="h-4.5 w-4.5 text-red-400" />
            <p>{alertError}</p>
          </motion.div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-neutral-900 pb-px">
          {(['analytics', 'enrollments', 'users', 'courses', 'instructors', 'schedule'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab 
                  ? 'border-yellow-500 text-yellow-500' 
                  : 'border-transparent text-neutral-450 hover:text-white'
              }`}
            >
              {tab === 'analytics' ? 'Stats Overview' : tab}
            </button>
          ))}
        </div>

        {/* --- Content Area --- */}
        {isLoading ? (
          <div className="py-24 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-yellow-500 mx-auto mb-2" />
            <p className="text-neutral-400 text-sm">Fetching records...</p>
          </div>
        ) : (
          <div className="pt-2">
            
            {/* Tab 1: Stats Overview */}
            {activeTab === 'analytics' && analytics && (
              <div className="space-y-8">
                {/* Stats Counters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Active Students', value: analytics.total_students, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                    { label: 'Registered Programs', value: analytics.total_courses, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                    { label: 'Academy Coaches', value: analytics.total_instructors, color: 'text-emerald-450', bg: 'bg-emerald-500/10' },
                    { label: 'Total Registrations', value: analytics.total_enrollments, color: 'text-rose-400', bg: 'bg-rose-500/10' },
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-md flex items-center space-x-4">
                      <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color}`}>
                        <BarChart2 className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-neutral-450 text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
                        <h4 className="text-2xl font-black text-white mt-0.5">{stat.value}</h4>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Bookings Table */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-md">
                  <h3 className="text-lg font-bold tracking-tight mb-4">Recent Bookings Queue</h3>
                  {analytics.recent_enrollments.length === 0 ? (
                    <p className="text-neutral-500 text-sm py-4 text-center">No recent bookings recorded.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm divide-y divide-neutral-800">
                        <thead>
                          <tr className="text-neutral-400 font-semibold text-xs uppercase tracking-wider">
                            <th className="pb-3 pl-4">Student</th>
                            <th className="pb-3">Course</th>
                            <th className="pb-3">Batch</th>
                            <th className="pb-3 pr-4">Booked Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/60">
                          {analytics.recent_enrollments.map((en) => (
                            <tr key={en.id} className="hover:bg-white/5 transition-colors">
                              <td className="py-3.5 pl-4 font-bold text-white">{en.full_name}</td>
                              <td className="py-3.5 text-neutral-300">{en.selected_course}</td>
                              <td className="py-3.5 text-neutral-450">{en.preferred_batch}</td>
                              <td className="py-3.5 text-neutral-500 pr-4">{new Date(en.created_at).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: User List */}
            {activeTab === 'users' && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-md">
                <h3 className="text-lg font-bold tracking-tight mb-6">User Accounts</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm divide-y divide-neutral-800">
                    <thead>
                      <tr className="text-neutral-400 font-semibold text-xs uppercase tracking-wider">
                        <th className="pb-3 pl-4">Full Name</th>
                        <th className="pb-3">Email Address</th>
                        <th className="pb-3">Role</th>
                        <th className="pb-3">Account Status</th>
                        <th className="pb-3 pr-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3.5 pl-4 font-bold text-white">{u.full_name}</td>
                          <td className="py-3.5 text-neutral-350">{u.email}</td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.role.toLowerCase() === 'admin' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-neutral-950 text-neutral-400 border border-neutral-800'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3.5">
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold ${u.is_active ? 'text-emerald-450' : 'text-neutral-550'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-emerald-500' : 'bg-neutral-500'}`} />
                              {u.is_active ? 'Active' : 'Suspended'}
                            </span>
                          </td>
                          <td className="py-3.5 pr-4 text-right space-x-2">
                            <button 
                              onClick={() => { setUserForm({ id: u.id, role: u.role, is_active: u.is_active }); setIsUserFormOpen(true); }}
                              className="text-neutral-450 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                              title="Edit user role"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(u.id)}
                              className="text-neutral-550 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all cursor-pointer"
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

            {/* Tab 3: Courses Panel */}
            {activeTab === 'courses' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((c) => (
                  <div key={c.id} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-md flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="font-extrabold text-white text-base sm:text-lg">{c.title}</h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 px-2.5 py-0.5 rounded text-neutral-400">
                          {c.instrument}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-450 line-clamp-3 leading-relaxed">{c.description}</p>
                      <div className="pt-2 flex justify-between text-xs font-semibold text-neutral-350">
                        <span>Duration: {c.duration}</span>
                        <span className="text-yellow-500">Fees: ₹{c.fees}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 border-t border-neutral-800/80 pt-3">
                      <button 
                        onClick={() => { setCourseForm({ id: c.id, title: c.title, instrument: c.instrument, level: c.level, duration: c.duration, fees: c.fees, description: c.description, image_url: c.image_url }); setIsCourseFormOpen(true); }}
                        className="bg-white/5 hover:bg-white/10 text-white font-semibold py-1.5 px-3 rounded-lg border border-white/10 text-xs transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteCourse(c.id)}
                        className="bg-red-500/10 hover:bg-red-500/15 text-red-400 font-semibold py-1.5 px-3 rounded-lg border border-red-500/10 text-xs transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 4: Instructors Panel */}
            {activeTab === 'instructors' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {instructors.map((i) => (
                  <div key={i.id} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-md flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="font-extrabold text-white text-base sm:text-lg">{i.full_name}</h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded text-indigo-400">
                          {i.instrument}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-350 font-medium">{i.qualification}</p>
                      <p className="text-[11px] text-neutral-450 line-clamp-3 leading-relaxed">{i.bio}</p>
                      <div className="pt-2 text-xs text-neutral-400 flex justify-between">
                        <span>Exp: {i.experience_years} Years</span>
                        <span>Languages: {i.languages}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 border-t border-neutral-800/80 pt-3">
                      <button 
                        onClick={() => { setInstructorForm({ id: i.id, full_name: i.full_name, instrument: i.instrument, qualification: i.qualification, experience_years: i.experience_years, bio: i.bio, languages: i.languages, specialization: i.specialization, image_url: i.image_url }); setIsInstructorFormOpen(true); }}
                        className="bg-white/5 hover:bg-white/10 text-white font-semibold py-1.5 px-3 rounded-lg border border-white/10 text-xs transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteInstructor(i.id)}
                        className="bg-red-500/10 hover:bg-red-500/15 text-red-400 font-semibold py-1.5 px-3 rounded-lg border border-red-500/10 text-xs transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 5: Schedules Panel */}
            {activeTab === 'schedule' && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-md">
                <h3 className="text-lg font-bold tracking-tight mb-6">Class Schedule Slots</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm divide-y divide-neutral-800">
                    <thead>
                      <tr className="text-neutral-400 font-semibold text-xs uppercase tracking-wider">
                        <th className="pb-3 pl-4">Course Name</th>
                        <th className="pb-3">Day / Time</th>
                        <th className="pb-3">Batch / Level</th>
                        <th className="pb-3">Coach</th>
                        <th className="pb-3">Room / Seats</th>
                        <th className="pb-3 pr-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {schedules.map((s) => (
                        <tr key={s.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3.5 pl-4 font-bold text-white">{s.course_name}</td>
                          <td className="py-3.5 text-neutral-300">
                            {s.day} <br />
                            <span className="text-xs text-neutral-450">{s.start_time} - {s.end_time}</span>
                          </td>
                          <td className="py-3.5 text-neutral-350">
                            {s.batch} <br />
                            <span className="text-xs text-neutral-500">{s.level}</span>
                          </td>
                          <td className="py-3.5 text-neutral-300 font-medium">{s.instructor}</td>
                          <td className="py-3.5 text-neutral-450">
                            {s.room} • {s.available_seats} Seats
                          </td>
                          <td className="py-3.5 pr-4 text-right space-x-2">
                            <button 
                              onClick={() => { setScheduleForm({ id: s.id, course_name: s.course_name, instructor: s.instructor, day: s.day, start_time: s.start_time, end_time: s.end_time, batch: s.batch, level: s.level, room: s.room, available_seats: s.available_seats }); setIsScheduleFormOpen(true); }}
                              className="text-neutral-450 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                              title="Edit slot details"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteSchedule(s.id)}
                              className="text-neutral-550 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all cursor-pointer"
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

            {/* Tab 6: Enrollments list */}
            {activeTab === 'enrollments' && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-md">
                <h3 className="text-lg font-bold tracking-tight mb-6">Course Registrations Queue</h3>
                {enrollments.length === 0 ? (
                  <p className="text-neutral-500 text-sm py-4 text-center">No registrations booked.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm divide-y divide-neutral-800">
                      <thead>
                        <tr className="text-neutral-400 font-semibold text-xs uppercase tracking-wider">
                          <th className="pb-3 pl-4">Student Info</th>
                          <th className="pb-3">Program</th>
                          <th className="pb-3">Details</th>
                          <th className="pb-3">Verification</th>
                          <th className="pb-3 pr-4 text-right">Approve / Reject Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/60">
                        {enrollments.map((en) => (
                          <tr key={en.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-3.5 pl-4">
                              <span className="font-bold text-white">{en.full_name}</span> <br />
                              <span className="text-xs text-neutral-450">{en.email} • {en.phone}</span>
                            </td>
                            <td className="py-3.5 text-neutral-300 font-bold">{en.selected_course}</td>
                            <td className="py-3.5 text-neutral-450 text-xs">
                              Age: {en.age} <br />
                              {en.experience_level} • {en.preferred_batch}
                            </td>
                            <td className="py-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                en.status.toLowerCase() === 'approved' 
                                  ? 'bg-emerald-500/10 text-emerald-450'
                                  : en.status.toLowerCase() === 'rejected'
                                  ? 'bg-red-500/10 text-red-400'
                                  : 'bg-yellow-500/10 text-yellow-450'
                              }`}>
                                {en.status}
                              </span>
                            </td>
                            <td className="py-3.5 pr-4 text-right space-x-1">
                              {en.status.toLowerCase() === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateEnrollment(en.id, 'Approved')}
                                    className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 p-1.5 rounded-lg border border-emerald-500/20 text-xs transition-all cursor-pointer"
                                    title="Approve registration"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateEnrollment(en.id, 'Rejected')}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-1.5 rounded-lg border border-red-500/20 text-xs transition-all cursor-pointer"
                                    title="Reject registration"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleDeleteEnrollment(en.id)}
                                className="text-neutral-550 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all cursor-pointer animate-none"
                                title="Remove request record"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </div>

      {/* --- FORM MODALS --- */}

      {/* Course Modal */}
      {isCourseFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold">{courseForm.id > 0 ? 'Edit Course Details' : 'Add New Course'}</h3>
            <form onSubmit={handleCourseSubmit} className="space-y-3.5">
              <input 
                type="text" placeholder="Course Title (e.g. Violin Masterclass)" value={courseForm.title} onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
              />
              <input 
                type="text" placeholder="Instrument (e.g. Violin)" value={courseForm.instrument} onChange={(e) => setCourseForm({...courseForm, instrument: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
              />
              <div className="grid grid-cols-2 gap-3">
                <select value={courseForm.level} onChange={(e) => setCourseForm({...courseForm, level: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none">
                  {['Beginner', 'Intermediate', 'Advanced'].map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                </select>
                <input 
                  type="text" placeholder="Duration (e.g. 24 Weeks)" value={courseForm.duration} onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
                />
              </div>
              <input 
                type="number" placeholder="Tuition Fee (₹)" value={courseForm.fees || ''} onChange={(e) => setCourseForm({...courseForm, fees: Number(e.target.value)})}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
              />
              <textarea 
                placeholder="Course Syllabus/Description..." rows={3} value={courseForm.description} onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none resize-none" required
              />
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
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold">{instructorForm.id > 0 ? 'Edit Instructor Profile' : 'Add New Instructor'}</h3>
            <form onSubmit={handleInstructorSubmit} className="space-y-3.5">
              <input 
                type="text" placeholder="Full Name" value={instructorForm.full_name} onChange={(e) => setInstructorForm({...instructorForm, full_name: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
              />
              <input 
                type="text" placeholder="Instrument (e.g. Guitar)" value={instructorForm.instrument} onChange={(e) => setInstructorForm({...instructorForm, instrument: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
              />
              <input 
                type="text" placeholder="Qualifications (e.g. TCL Grade 8)" value={instructorForm.qualification} onChange={(e) => setInstructorForm({...instructorForm, qualification: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
              />
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="number" placeholder="Exp (Years)" value={instructorForm.experience_years || ''} onChange={(e) => setInstructorForm({...instructorForm, experience_years: Number(e.target.value)})}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
                />
                <input 
                  type="text" placeholder="Languages (e.g. English)" value={instructorForm.languages} onChange={(e) => setInstructorForm({...instructorForm, languages: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
                />
              </div>
              <input 
                type="text" placeholder="Specialization (e.g. Classical composition)" value={instructorForm.specialization} onChange={(e) => setInstructorForm({...instructorForm, specialization: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
              />
              <textarea 
                placeholder="Instructor Short Bio..." rows={3} value={instructorForm.bio} onChange={(e) => setInstructorForm({...instructorForm, bio: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none resize-none" required
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsInstructorFormOpen(false)} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer">Cancel</button>
                <button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer">Save Instructor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {isScheduleFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold">{scheduleForm.id > 0 ? 'Edit Schedule Slot' : 'Add New Schedule Slot'}</h3>
            <form onSubmit={handleScheduleSubmit} className="space-y-3">
              <input 
                type="text" placeholder="Course Name" value={scheduleForm.course_name} onChange={(e) => setScheduleForm({...scheduleForm, course_name: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
              />
              <input 
                type="text" placeholder="Instructor Name" value={scheduleForm.instructor} onChange={(e) => setScheduleForm({...scheduleForm, instructor: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
              />
              <div className="grid grid-cols-2 gap-3">
                <select value={scheduleForm.day} onChange={(e) => setScheduleForm({...scheduleForm, day: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={scheduleForm.batch} onChange={(e) => setScheduleForm({...scheduleForm, batch: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none">
                  {['Morning Batch', 'Afternoon Batch', 'Evening Batch'].map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="text" placeholder="Start Time (e.g. 09:00 AM)" value={scheduleForm.start_time} onChange={(e) => setScheduleForm({...scheduleForm, start_time: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
                />
                <input 
                  type="text" placeholder="End Time (e.g. 10:30 AM)" value={scheduleForm.end_time} onChange={(e) => setScheduleForm({...scheduleForm, end_time: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none" required
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <select value={scheduleForm.level} onChange={(e) => setScheduleForm({...scheduleForm, level: e.target.value})}
                  className="col-span-1 w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-3 text-xs focus:outline-none">
                  {['Beginner', 'Intermediate', 'Advanced'].map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                </select>
                <input 
                  type="text" placeholder="Room" value={scheduleForm.room} onChange={(e) => setScheduleForm({...scheduleForm, room: e.target.value})}
                  className="col-span-1 w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-3 py-3 text-sm focus:outline-none" required
                />
                <input 
                  type="number" placeholder="Seats" value={scheduleForm.available_seats || ''} onChange={(e) => setScheduleForm({...scheduleForm, available_seats: Number(e.target.value)})}
                  className="col-span-1 w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-3 py-3 text-sm focus:outline-none" required
                />
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
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-sm space-y-4">
            <h3 className="text-lg font-bold">Edit User Privileges</h3>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-450 uppercase">System Role</label>
                <select 
                  value={userForm.role} 
                  onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none"
                >
                  <option value="Student">Student</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-450 uppercase">Account Access Status</label>
                <select 
                  value={userForm.is_active ? 'true' : 'false'} 
                  onChange={(e) => setUserForm({...userForm, is_active: e.target.value === 'true'})}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none"
                >
                  <option value="true">Active (Access Allowed)</option>
                  <option value="false">Suspended (Access Revoked)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsUserFormOpen(false)} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer">Cancel</button>
                <button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer">Save Role</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
