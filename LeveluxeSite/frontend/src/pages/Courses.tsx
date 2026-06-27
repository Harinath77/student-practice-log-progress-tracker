import type { FC } from 'react';
import { motion } from 'framer-motion';
import { useCourses } from '../hooks/useCourses';
import CourseCard from '../components/courses/CourseCard';
import CourseFilters from '../components/courses/CourseFilters';
import CourseSearch from '../components/courses/CourseSearch';
import { CourseSkeletonList } from '../components/courses/CourseSkeleton';
import EmptyCourses from '../components/courses/EmptyCourses';
import { AlertCircle, RotateCcw } from 'lucide-react';

const Courses: FC = () => {
  const {
    courses,
    loading,
    error,
    refresh,
    searchTerm,
    setSearchTerm,
    selectedLevel,
    setSelectedLevel,
    selectedInstrument,
    setSelectedInstrument,
    sortBy,
    setSortBy,
  } = useCourses();

  const handleReset = () => {
    setSearchTerm('');
    setSelectedLevel('All');
    setSelectedInstrument('All');
    setSortBy('default');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
  };

  return (
    <div className="w-full flex flex-col bg-neutral-950 text-white min-h-screen">
      
      {/* Title Header Banner - Full Width */}
      <div className="relative w-full py-24 bg-gradient-to-br from-neutral-950 via-neutral-900 to-indigo-950 text-white text-center pt-28 border-b border-neutral-900">
        <div className="absolute inset-0 bg-indigo-500/5 rounded-3xl blur-[120px]" />
        <div className="relative z-10 space-y-4 max-w-3xl mx-auto px-4">
          <span className="text-yellow-400 font-bold text-xs uppercase tracking-widest bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
            Our Curriculum
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight">
            Explore Music Programs
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mt-2">
            From basic instrument controls to performance-level training, select a program and launch your musical path with expert guidance.
          </p>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Course List - Centered Page Content */}
      <div className="w-full py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
            
            {/* Left Column: Sidebar Filters - Dark theme styled */}
            <div className="lg:col-span-1 bg-neutral-900/55 border border-neutral-800 rounded-3xl p-6 space-y-8 lg:sticky lg:top-28 shadow-md text-left backdrop-blur-md">
              <h3 className="text-lg font-extrabold text-white border-b border-neutral-800 pb-4">
                Curriculum Filters
              </h3>
              <CourseFilters
                selectedLevel={selectedLevel}
                setSelectedLevel={setSelectedLevel}
                selectedInstrument={selectedInstrument}
                setSelectedInstrument={setSelectedInstrument}
              />
              <button
                onClick={handleReset}
                className="w-full text-xs font-semibold text-yellow-400 hover:text-yellow-350 hover:underline flex items-center justify-center space-x-1.5 pt-2 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset all filters</span>
              </button>
            </div>

            {/* Right Column: Search + Course List */}
            <div className="lg:col-span-3 space-y-8">
              
              {/* Search bar & Sorting */}
              <CourseSearch
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />

              {/* Error Banner */}
              {error && (
                <div className="bg-red-950/20 border border-red-900/50 text-red-400 rounded-2xl p-6 flex items-start space-x-3 text-left">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="space-y-3 flex-grow">
                    <h4 className="font-bold text-red-200">API Connection Failed</h4>
                    <p className="text-sm">{error}</p>
                    <button
                      onClick={refresh}
                      className="bg-red-900/50 hover:bg-red-800/60 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 border border-red-800/80 shadow-md cursor-pointer"
                    >
                      Retry Connection
                    </button>
                  </div>
                </div>
              )}

              {/* Loading Skeletons */}
              {loading && <CourseSkeletonList count={6} />}

              {/* Course Card Grid */}
              {!loading && (
                <>
                  {courses.length === 0 ? (
                    <EmptyCourses onReset={handleReset} />
                  ) : (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                      {courses.map((course) => (
                        <motion.div key={course.id} variants={itemVariants}>
                          <CourseCard course={course} />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
