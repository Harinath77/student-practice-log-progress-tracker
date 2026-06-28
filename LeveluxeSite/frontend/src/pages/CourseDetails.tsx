import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Clock, Award, BookOpen, CheckCircle, 
  HelpCircle, Calendar, User, ShieldAlert, Sparkles 
} from 'lucide-react';
import { courseService } from '../services/courseService';
import { instructorService } from '../services/instructorService';
import { scheduleService } from '../services/scheduleService';
import { courseDetailsMap } from '../data/courseDetails';
import type { Course } from '../types/course';
import type { Instructor } from '../types/instructor';
import type { Schedule } from '../types/schedule';
import EnrollmentModal from '../components/enroll/EnrollmentModal';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const courseId = id ? parseInt(id) : 1;

  const [course, setCourse] = useState<Course | null>(null);
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  useEffect(() => {
    const fetchAllDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch Course details
        let currentCourse: Course | null = null;
        try {
          currentCourse = await courseService.getCourseById(courseId);
        } catch (err) {
          console.warn("API failed to get course. Fetching from local cache.", err);
          const localCourses = await import('../data/courses.json');
          const found = localCourses.default.find((c) => c.id === courseId);
          if (found) currentCourse = found as Course;
        }

        if (!currentCourse) {
          throw new Error(`Course with ID ${courseId} not found.`);
        }
        setCourse(currentCourse);

        // 2. Fetch Instructors to find one matching the instrument
        try {
          const allInstructors = await instructorService.getAllInstructors();
          const match = allInstructors.find(
            (inst) => inst.instrument.toLowerCase() === currentCourse!.instrument.toLowerCase()
          );
          if (match) setInstructor(match);
        } catch (err) {
          console.warn("API failed to get instructors for course details page.", err);
          const localInstructors = await import('../data/instructors.json');
          const match = localInstructors.default.find(
            (inst) => inst.instrument.toLowerCase() === currentCourse!.instrument.toLowerCase()
          );
          if (match) setInstructor(match as any);
        }

        // 3. Fetch Schedules to find timings matching this course title
        try {
          const allSchedules = await scheduleService.getAllSchedules();
          const match = allSchedules.filter(
            (slot) => slot.course_name.toLowerCase().includes(currentCourse!.title.toLowerCase()) ||
                      currentCourse!.title.toLowerCase().includes(slot.course_name.toLowerCase())
          );
          setSchedules(match);
        } catch (err) {
          console.warn("API failed to get schedules for course details page.", err);
          const localSchedules = await import('../data/schedule.json');
          const match = localSchedules.default.filter(
            (slot) => slot.course_name.toLowerCase().includes(currentCourse!.title.toLowerCase()) ||
                      currentCourse!.title.toLowerCase().includes(slot.course_name.toLowerCase())
          );
          setSchedules(match as any);
        }

      } catch (err: any) {
        setError(err.message || 'Something went wrong while fetching course details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllDetails();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold tracking-wider text-neutral-400">Loading course curriculum...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white p-4">
        <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-8 text-center space-y-6">
          <ShieldAlert className="h-16 w-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-extrabold">Failed to load Course</h2>
          <p className="text-neutral-400 text-sm">{error || "Course not found"}</p>
          <Link 
            to="/courses"
            className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold px-6 py-3 rounded-xl transition-all"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const staticDetails = courseDetailsMap[course.id] || {
    curriculum: ["Core mechanics and practice", "Intermediate exercises", "Advanced solo composition"],
    learningOutcomes: ["Master basic elements", "Understand chord progressions"],
    faqs: [{ question: "Are trial sessions available?", answer: "Yes, you can register for a trial session using our enrollment form." }],
    galleryGradients: ["from-indigo-900 to-neutral-900", "from-violet-900 to-neutral-900"]
  };

  return (
    <div className="w-full flex flex-col bg-neutral-950 text-white min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Back Link */}
        <Link 
          to="/courses" 
          className="inline-flex items-center text-sm font-bold text-neutral-400 hover:text-yellow-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Courses
        </Link>

        {/* Hero Header */}
        <div className="relative rounded-3xl bg-neutral-900 border border-neutral-800 p-8 md:p-12 overflow-hidden mb-12">
          <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-3xl -z-10" />
          <div className="relative z-10 max-w-4xl space-y-6 text-left">
            <div className="flex flex-wrap gap-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full">
                {course.instrument}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full">
                {course.level}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {course.title}
            </h1>
            <p className="text-neutral-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              {course.description}
            </p>
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Left Column: Course details, curriculum, outcomes, FAQs, Gallery */}
          <div className="lg:col-span-2 space-y-12 text-left">
            
            {/* Learning Outcomes */}
            <div className="bg-neutral-900/40 border border-neutral-850 p-8 rounded-3xl backdrop-blur-md">
              <h2 className="text-xl sm:text-2xl font-extrabold mb-6 flex items-center space-x-2.5">
                <Sparkles className="h-6 w-6 text-yellow-400" />
                <span>What You Will Learn</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {staticDetails.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-300 text-sm leading-relaxed">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div className="bg-neutral-900/40 border border-neutral-850 p-8 rounded-3xl backdrop-blur-md">
              <h2 className="text-xl sm:text-2xl font-extrabold mb-6 flex items-center space-x-2.5">
                <BookOpen className="h-6 w-6 text-yellow-400" />
                <span>Curriculum Details</span>
              </h2>
              <div className="space-y-4">
                {staticDetails.curriculum.map((week, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start space-x-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800"
                  >
                    <span className="h-6 w-6 rounded-full bg-yellow-500/10 text-yellow-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-neutral-300 text-sm leading-normal">{week}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery */}
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-extrabold">Studio Space Gallery</h2>
              <div className="grid grid-cols-3 gap-4">
                {staticDetails.galleryGradients.map((gradient, idx) => (
                  <div 
                    key={idx}
                    className={`h-36 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center border border-white/5 opacity-80 hover:opacity-100 transition-opacity`}
                  >
                    <BookOpen className="h-8 w-8 text-white/35" />
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-neutral-900/40 border border-neutral-850 p-8 rounded-3xl backdrop-blur-md">
              <h2 className="text-xl sm:text-2xl font-extrabold mb-6 flex items-center space-x-2.5">
                <HelpCircle className="h-6 w-6 text-yellow-400" />
                <span>Frequently Asked Questions</span>
              </h2>
              <div className="space-y-6 divide-y divide-neutral-850">
                {staticDetails.faqs.map((faq, idx) => (
                  <div key={idx} className={`${idx > 0 ? 'pt-6' : ''}`}>
                    <h4 className="text-sm sm:text-base font-bold text-white mb-2">{faq.question}</h4>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Pricing, Duration, Instructor, Schedules */}
          <div className="lg:col-span-1 space-y-8 text-left">
            
            {/* Enrollment Sidebar Card */}
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl space-y-6 lg:sticky lg:top-28">
              
              {/* Price and Details */}
              <div className="space-y-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold text-yellow-400">
                    ₹{course.fees.toLocaleString('en-IN')}
                  </span>
                  <span className="text-neutral-400 text-xs">Total Course Fee</span>
                </div>
                <div className="space-y-3.5 pt-4 border-t border-neutral-800/80 text-xs font-semibold text-neutral-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-neutral-450">
                      <Clock className="h-4 w-4" />
                      <span>Duration</span>
                    </div>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-neutral-450">
                      <Award className="h-4 w-4" />
                      <span>Certification</span>
                    </div>
                    <span>Board Certified</span>
                  </div>
                </div>
              </div>

              {/* Enroll Button */}
              <button 
                onClick={() => setIsEnrollModalOpen(true)}
                className="w-full inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-yellow-500/10 active:scale-98 cursor-pointer"
              >
                Enroll Now
              </button>

              {/* Available Batches / Schedules */}
              {schedules.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-neutral-800/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center space-x-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>Weekly Batches</span>
                  </h4>
                  <div className="space-y-2">
                    {schedules.map((slot) => (
                      <div 
                        key={slot.id} 
                        className="text-xs bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex flex-col space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{slot.day}</span>
                          <span className="text-yellow-450 text-[10px] bg-yellow-500/5 px-2 py-0.5 rounded-full border border-yellow-500/10 font-semibold">{slot.batch}</span>
                        </div>
                        <div className="flex items-center justify-between text-neutral-400">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{slot.start_time} - {slot.end_time}</span>
                          </div>
                          <span className="text-[10px] text-neutral-500">Seats: {slot.available_seats} Left</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assigned Instructor Profile Summary */}
              {instructor && (
                <div className="space-y-3 pt-4 border-t border-neutral-800/80 text-xs">
                  <h4 className="font-bold uppercase tracking-wider text-neutral-400 flex items-center space-x-1.5">
                    <User className="h-4 w-4" />
                    <span>Course Mentor</span>
                  </h4>
                  <Link 
                    to={`/instructors/${instructor.id}`}
                    className="flex items-center space-x-3 p-2.5 rounded-2xl bg-neutral-950/60 border border-neutral-800/60 hover:border-neutral-700 transition-colors group"
                  >
                    <div className="h-10 w-10 rounded-full bg-neutral-900 border border-yellow-500/30 flex items-center justify-center font-bold text-yellow-400 group-hover:border-yellow-400 transition-all">
                      {instructor.full_name.split(' ').map(n=>n[0]).join('').toUpperCase()}
                    </div>
                    <div className="text-left flex-grow">
                      <p className="font-bold text-white group-hover:text-yellow-400 transition-colors">{instructor.full_name}</p>
                      <p className="text-neutral-550 text-[10px] mt-0.5">{instructor.qualification}</p>
                    </div>
                  </Link>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* Enrollment Modal */}
      {course && (
        <EnrollmentModal
          isOpen={isEnrollModalOpen}
          onClose={() => setIsEnrollModalOpen(false)}
          defaultCourse={course.title}
          defaultLevel={course.level}
        />
      )}

    </div>
  );
};

export default CourseDetails;
