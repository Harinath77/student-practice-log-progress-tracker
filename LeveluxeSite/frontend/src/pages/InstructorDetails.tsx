import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Award, Sparkles, Languages, Clock, BookOpen, 
  ShieldAlert, Star, MessageSquare, Calendar 
} from 'lucide-react';
import { instructorService } from '../services/instructorService';
import { courseService } from '../services/courseService';
import { scheduleService } from '../services/scheduleService';
import type { Instructor } from '../types/instructor';
import type { Course } from '../types/course';
import type { Schedule } from '../types/schedule';
import EnrollmentModal from '../components/enroll/EnrollmentModal';

const InstructorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const instructorId = id ? parseInt(id) : 1;

  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  useEffect(() => {
    const fetchInstructorAllDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch Instructor
        let currentInst: Instructor | null = null;
        try {
          currentInst = await instructorService.getInstructorById(instructorId);
        } catch (err) {
          console.warn("API failed to get instructor. Fetching from local cache.", err);
          const localInstructors = await import('../data/instructors.json');
          const found = localInstructors.default.find((i) => i.id === instructorId);
          if (found) currentInst = found as any;
        }

        if (!currentInst) {
          throw new Error(`Instructor with ID ${instructorId} not found.`);
        }
        setInstructor(currentInst);

        // 2. Fetch Courses to find matching instrument
        try {
          const allCourses = await courseService.getAllCourses();
          const match = allCourses.filter(
            (c) => c.instrument.toLowerCase() === currentInst!.instrument.toLowerCase()
          );
          setCourses(match);
        } catch (err) {
          console.warn("API failed to get courses for instructor details page.", err);
          const localCourses = await import('../data/courses.json');
          const match = localCourses.default.filter(
            (c) => c.instrument.toLowerCase() === currentInst!.instrument.toLowerCase()
          );
          setCourses(match as Course[]);
        }

        // 3. Fetch Schedules to find slots taught by this instructor
        try {
          const allSchedules = await scheduleService.getAllSchedules();
          const match = allSchedules.filter(
            (slot) => slot.instructor.toLowerCase().includes(currentInst!.full_name.toLowerCase()) ||
                      currentInst!.full_name.toLowerCase().includes(slot.instructor.toLowerCase())
          );
          setSchedules(match);
        } catch (err) {
          console.warn("API failed to get schedules for instructor details page.", err);
          const localSchedules = await import('../data/schedule.json');
          const match = localSchedules.default.filter(
            (slot) => slot.instructor.toLowerCase().includes(currentInst!.full_name.toLowerCase()) ||
                      currentInst!.full_name.toLowerCase().includes(slot.instructor.toLowerCase())
          );
          setSchedules(match as any);
        }

      } catch (err: any) {
        setError(err.message || 'Something went wrong while fetching instructor details.');
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorAllDetails();
  }, [instructorId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold tracking-wider text-neutral-400">Loading faculty profile...</p>
        </div>
      </div>
    );
  }

  if (error || !instructor) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white p-4">
        <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-8 text-center space-y-6">
          <ShieldAlert className="h-16 w-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-extrabold">Profile Not Found</h2>
          <p className="text-neutral-400 text-sm">{error || "Instructor not found"}</p>
          <Link 
            to="/instructors"
            className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold px-6 py-3 rounded-xl transition-all"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Faculty
          </Link>
        </div>
      </div>
    );
  }

  // Generate initials for avatar
  const initials = instructor.full_name.split(' ').map(n=>n[0]).join('').toUpperCase();

  // Custom mock reviews for instructor
  const mockReviews = [
    {
      studentName: "Aditya P.",
      rating: 5,
      comment: `Learning with ${instructor.full_name} has been amazing! The feedback is incredibly structured and helped me clean up my technique in just a few weeks.`,
      date: "2 weeks ago"
    },
    {
      studentName: "Srinivas K.",
      rating: 5,
      comment: "Highly professional mentor. Patient with errors, focuses heavily on physical posture and timing synchronization. Trinity exams prep was very thorough.",
      date: "1 month ago"
    }
  ];

  return (
    <div className="w-full flex flex-col bg-neutral-950 text-white min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Back Link */}
        <Link 
          to="/instructors" 
          className="inline-flex items-center text-sm font-bold text-neutral-400 hover:text-yellow-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Faculty
        </Link>

        {/* Profile Card Header */}
        <div className="relative rounded-3xl bg-neutral-900 border border-neutral-800 p-8 md:p-12 overflow-hidden mb-12 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="absolute inset-0 bg-yellow-500/5 blur-3xl rounded-3xl -z-10" />
          
          {/* Large initials avatar */}
          <div className="h-32 w-32 rounded-full bg-neutral-950 border-4 border-yellow-500/30 flex items-center justify-center font-extrabold text-yellow-400 text-4xl shadow-2xl relative flex-shrink-0">
            {initials}
            <span className="absolute bottom-1.5 right-1.5 p-1.5 bg-yellow-500 rounded-full text-neutral-900 border-2 border-neutral-950">
              <Award className="h-4 w-4" />
            </span>
          </div>

          {/* Details */}
          <div className="text-center md:text-left space-y-4 flex-grow">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full">
                {instructor.instrument} Specialist
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 text-white">
                {instructor.full_name}
              </h1>
            </div>
            
            <p className="text-neutral-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              {instructor.bio}
            </p>
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Left Column: Qualifications, Taught Courses, Reviews */}
          <div className="lg:col-span-2 space-y-12 text-left">
            
            {/* Professional profile details */}
            <div className="bg-neutral-900/40 border border-neutral-850 p-8 rounded-3xl backdrop-blur-md grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center space-x-1.5">
                  <Award className="h-4 w-4" />
                  <span>Credential</span>
                </span>
                <p className="text-white text-sm font-semibold leading-relaxed">{instructor.qualification}</p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center space-x-1.5">
                  <Sparkles className="h-4 w-4" />
                  <span>Specialization</span>
                </span>
                <p className="text-white text-sm font-semibold leading-relaxed">{instructor.specialization}</p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center space-x-1.5">
                  <Languages className="h-4 w-4" />
                  <span>Languages</span>
                </span>
                <p className="text-white text-sm font-semibold leading-relaxed">{instructor.languages}</p>
              </div>

            </div>

            {/* Program courses taught */}
            {courses.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-extrabold flex items-center space-x-2.5">
                  <BookOpen className="h-6 w-6 text-yellow-400" />
                  <span>Courses Taught by Mentor</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map((c) => (
                    <Link 
                      key={c.id} 
                      to={`/courses/${c.id}`}
                      className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:-translate-y-1 p-6 rounded-2xl transition-all block group"
                    >
                      <h4 className="font-extrabold text-white text-base group-hover:text-yellow-400 transition-colors">
                        {c.title}
                      </h4>
                      <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                        {c.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-4 text-[10px] font-bold text-neutral-450 uppercase tracking-wider">
                        <span>{c.duration}</span>
                        <span>•</span>
                        <span>{c.level}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Student Reviews */}
            <div className="bg-neutral-900/40 border border-neutral-850 p-8 rounded-3xl backdrop-blur-md space-y-6">
              <h2 className="text-xl sm:text-2xl font-extrabold flex items-center space-x-2.5">
                <MessageSquare className="h-6 w-6 text-yellow-400" />
                <span>Student Reviews & Feedback</span>
              </h2>
              <div className="space-y-6 divide-y divide-neutral-850">
                {mockReviews.map((rev, idx) => (
                  <div key={idx} className={`${idx > 0 ? 'pt-6' : ''} space-y-3`}>
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-bold text-white">{rev.studentName}</p>
                      <span className="text-[10px] text-neutral-500">{rev.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Experience, Slots, and CTA */}
          <div className="lg:col-span-1 space-y-8 text-left">
            
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl space-y-6 lg:sticky lg:top-28">
              
              {/* Experience Info */}
              <div className="space-y-2">
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Teaching & Stage Experience</p>
                <p className="text-3xl font-extrabold text-yellow-400">
                  {instructor.experience_years}+ Years
                </p>
              </div>

              {/* CTA Booking Button */}
              <button 
                onClick={() => setIsEnrollModalOpen(true)}
                className="w-full inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-yellow-500/10 active:scale-98 cursor-pointer"
              >
                Book Trial Class
              </button>

              {/* Class schedules taught by instructor */}
              {schedules.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-neutral-800/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center space-x-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>Weekly Classes Taught</span>
                  </h4>
                  <div className="space-y-2">
                    {schedules.map((slot) => (
                      <div 
                        key={slot.id} 
                        className="text-xs bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex flex-col space-y-1.5"
                      >
                        <div className="flex items-center justify-between font-bold text-white">
                          <span>{slot.day}</span>
                          <span className="text-[10px] text-yellow-450 bg-yellow-500/5 px-2 py-0.5 rounded-full border border-yellow-500/10">{slot.batch}</span>
                        </div>
                        <p className="text-neutral-350 text-[11px] font-semibold">{slot.course_name}</p>
                        <div className="flex items-center justify-between text-neutral-400 text-[10px]">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{slot.start_time} - {slot.end_time}</span>
                          </div>
                          <span>Room: {slot.room}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* Enrollment Modal */}
      {courses.length > 0 && (
        <EnrollmentModal
          isOpen={isEnrollModalOpen}
          onClose={() => setIsEnrollModalOpen(false)}
          defaultCourse={courses[0].title}
          defaultLevel={courses[0].level}
        />
      )}

    </div>
  );
};

export default InstructorDetails;
