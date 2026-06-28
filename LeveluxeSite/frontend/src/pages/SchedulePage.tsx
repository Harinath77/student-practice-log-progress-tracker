import React, { useCallback, useState } from 'react';
import { useSchedule } from '../hooks/useSchedule';
import ScheduleHero from '../components/schedule/ScheduleHero';
import TodayClasses from '../components/schedule/TodayClasses';
import ScheduleFilters from '../components/schedule/ScheduleFilters';
import WeeklyScheduleTable from '../components/schedule/WeeklyScheduleTable';
import BatchCards from '../components/schedule/BatchCards';
import FAQAccordion from '../components/schedule/FAQAccordion';
import ScheduleSkeleton from '../components/schedule/ScheduleSkeleton';
import EmptySchedule from '../components/schedule/EmptySchedule';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import EnrollmentModal from '../components/enroll/EnrollmentModal';

export const SchedulePage: React.FC = () => {
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [enrollCourse, setEnrollCourse] = useState('');
  const [enrollLevel, setEnrollLevel] = useState('Beginner');

  const {
    schedules,
    todaySchedules,
    loading,
    error,
    refresh,
    searchTerm,
    setSearchTerm,
    selectedDay,
    setSelectedDay,
    selectedInstructor,
    setSelectedInstructor,
    selectedInstrument,
    setSelectedInstrument,
    selectedLevel,
    setSelectedLevel,
    selectedBatch,
    setSelectedBatch,
    filterOptions,
  } = useSchedule();

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedDay('All');
    setSelectedInstructor('All');
    setSelectedInstrument('All');
    setSelectedLevel('All');
    setSelectedBatch('All');
  }, [
    setSearchTerm,
    setSelectedDay,
    setSelectedInstructor,
    setSelectedInstrument,
    setSelectedLevel,
    setSelectedBatch,
  ]);

  return (
    <div className="w-full flex flex-col bg-neutral-950 text-white min-h-screen">
      {/* Schedule Hero */}
      <ScheduleHero />

      {/* Main Content Area */}
      <div className="w-full py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Connection Error Banner (displays if API fails but loads fallback JSON data) */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-950/25 border border-red-900/50 text-red-400 rounded-3xl p-6 flex items-start space-x-4 text-left max-w-4xl mx-auto shadow-lg"
            >
              <AlertCircle className="h-6 w-6 mt-0.5 flex-shrink-0 text-red-400" />
              <div className="space-y-3 flex-grow">
                <h4 className="font-extrabold text-red-200">Unable to load schedule.</h4>
                <p className="text-xs sm:text-sm text-neutral-400">
                  We are having trouble connecting to the live API server. We've loaded the local schedule cache so you can still view program slots.
                </p>
                <button
                  onClick={refresh}
                  className="bg-red-900/40 hover:bg-red-800/50 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-red-800 transition-all cursor-pointer active:scale-95 shadow-md"
                >
                  Retry Connection
                </button>
              </div>
            </motion.div>
          )}

          {/* Loading Skeletons */}
          {loading && <ScheduleSkeleton />}

          {/* Render Schedule Sections if not Loading */}
          {!loading && (
            <>
              {/* Section 1: Today's Classes */}
              {todaySchedules.length > 0 && (
                <section className="space-y-6">
                  <TodayClasses todaySchedules={todaySchedules} />
                </section>
              )}

              {/* Section 2 & 4: Weekly Timetable & Filters Combined */}
              <section className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-5 text-left">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      Weekly Class Timetable
                    </h2>
                    <p className="text-neutral-450 text-xs sm:text-sm mt-1">
                      Filter slots by instrument, mentor, level, or batch to find the ideal block.
                    </p>
                  </div>
                  {(searchTerm !== '' ||
                    selectedDay !== 'All' ||
                    selectedInstructor !== 'All' ||
                    selectedInstrument !== 'All' ||
                    selectedLevel !== 'All' ||
                    selectedBatch !== 'All') && (
                    <button
                      onClick={handleResetFilters}
                      className="text-xs font-semibold text-yellow-450 hover:text-yellow-450/80 hover:underline flex items-center space-x-1 flex-shrink-0 cursor-pointer"
                    >
                      <span>Reset Filters</span>
                    </button>
                  )}
                </div>

                {/* Filters Row */}
                <ScheduleFilters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedDay={selectedDay}
                  setSelectedDay={setSelectedDay}
                  selectedInstructor={selectedInstructor}
                  setSelectedInstructor={setSelectedInstructor}
                  selectedInstrument={selectedInstrument}
                  setSelectedInstrument={setSelectedInstrument}
                  selectedLevel={selectedLevel}
                  setSelectedLevel={setSelectedLevel}
                  selectedBatch={selectedBatch}
                  setSelectedBatch={setSelectedBatch}
                  filterOptions={filterOptions}
                />

                {/* Table Render */}
                {schedules.length === 0 ? (
                  <EmptySchedule onReset={handleResetFilters} />
                ) : (
                  <WeeklyScheduleTable 
                    schedules={schedules} 
                    onEnroll={(slot) => {
                      setEnrollCourse(slot.course_name);
                      setEnrollLevel(slot.level);
                      setIsEnrollOpen(true);
                    }}
                  />
                )}
              </section>
            </>
          )}

        </div>
      </div>

      {/* Section 3: Batch Timings */}
      <BatchCards />

      {/* Section 5: FAQ Accordion */}
      <FAQAccordion />

      {/* Premium CTA banner to match courses/instructors page */}
      <section className="w-full py-24 bg-gradient-to-br from-neutral-950 via-neutral-900 to-indigo-950 text-white text-center border-t border-neutral-900 shadow-xl relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-indigo-500/5 rounded-full blur-[130px] -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
          <span className="text-yellow-400 font-bold text-xs uppercase tracking-widest bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
            Book Your Slot
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight pt-2 leading-tight">
            Found the Perfect Timing?
          </h2>
          <p className="text-neutral-450 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Reserve your weekly class slot. Get paired with our certified instructors and start learning on your schedule.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-yellow-500/20 active:scale-95 group cursor-pointer"
            >
              Enroll Today
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/courses"
              className="inline-flex items-center justify-center bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-xl border border-white/10 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Enrollment Modal */}
      <EnrollmentModal
        isOpen={isEnrollOpen}
        onClose={() => setIsEnrollOpen(false)}
        defaultCourse={enrollCourse}
        defaultLevel={enrollLevel}
      />
    </div>
  );
};

export default SchedulePage;
