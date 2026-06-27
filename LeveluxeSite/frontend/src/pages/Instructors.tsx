import type { FC } from 'react';
import { useInstructors } from '../hooks/useInstructors';
import InstructorGrid from '../components/instructors/InstructorGrid';
import InstructorFilters from '../components/instructors/InstructorFilters';
import InstructorSearch from '../components/instructors/InstructorSearch';
import { InstructorSkeletonList } from '../components/instructors/InstructorSkeleton';
import EmptyInstructorState from '../components/instructors/EmptyInstructorState';
import { AlertCircle, RotateCcw, Award, Music, Sparkles, Users, ArrowRight } from 'lucide-react';

const Instructors: FC = () => {
  const {
    instructors,
    loading,
    error,
    refresh,
    searchTerm,
    setSearchTerm,
    selectedInstrument,
    setSelectedInstrument,
  } = useInstructors();

  const handleReset = () => {
    setSearchTerm('');
    setSelectedInstrument('All');
  };

  const whyFaculty = [
    {
      icon: <Music className="h-6 w-6 text-yellow-500" />,
      title: "Professional Performers",
      description: "Our instructors are active stage artists, session musicians, and orchestral soloists who bring real-world performance insights into the classroom."
    },
    {
      icon: <Award className="h-6 w-6 text-yellow-500" />,
      title: "Certified Teachers",
      description: "Every faculty member holds degrees or grade certifications from ABRSM, Trinity College London, or Rockschool London, following global teaching standards."
    },
    {
      icon: <Sparkles className="h-6 w-6 text-yellow-500" />,
      title: "Performance Coaching",
      description: "We don't just teach notes; we prepare you for the stage. Focus on micro-expressions, posture, microphone handling, and stage presence."
    },
    {
      icon: <Users className="h-6 w-6 text-yellow-500" />,
      title: "Individual Attention",
      description: "With structured, personalized learning paths and small batch schedules, each student receives focused instruction catered to their goals."
    }
  ];

  return (
    <div className="w-full flex flex-col bg-neutral-950 text-white min-h-screen">
      
      {/* Title Header Banner - Full Width */}
      <div className="relative w-full py-24 bg-gradient-to-br from-neutral-950 via-neutral-900 to-indigo-950 text-white text-center pt-28 border-b border-neutral-900">
        <div className="absolute inset-0 bg-indigo-500/5 rounded-3xl blur-[120px]" />
        <div className="relative z-10 space-y-4 max-w-3xl mx-auto px-4">
          <span className="text-yellow-400 font-bold text-xs uppercase tracking-widest bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
            Faculty Directory
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight">
            Meet Our Expert Music Instructors
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mt-2">
            Learn from passionate musicians with years of teaching and professional performance experience.
          </p>
        </div>
      </div>

      {/* Main Grid: Search & Filter and Instructors Grid */}
      <div className="w-full py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Search and Filters panel */}
          <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-center justify-between bg-neutral-900/40 border border-neutral-850 p-6 rounded-3xl backdrop-blur-md">
            <InstructorFilters
              selectedInstrument={selectedInstrument}
              setSelectedInstrument={setSelectedInstrument}
            />
            <div className="flex items-center space-x-4 flex-grow max-w-md w-full">
              <InstructorSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              {(searchTerm !== '' || selectedInstrument !== 'All') && (
                <button
                  onClick={handleReset}
                  className="text-xs font-semibold text-yellow-400 hover:text-yellow-350 hover:underline flex items-center space-x-1.5 flex-shrink-0 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Connection Error Boundary */}
          {error && (
            <div className="bg-red-950/20 border border-red-900/50 text-red-400 rounded-2xl p-6 flex items-start space-x-3 text-left max-w-2xl mx-auto">
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
          {loading && <InstructorSkeletonList count={8} />}

          {/* Grid Render */}
          {!loading && (
            <>
              {instructors.length === 0 ? (
                <EmptyInstructorState onReset={handleReset} />
              ) : (
                <InstructorGrid instructors={instructors} />
              )}
            </>
          )}

        </div>
      </div>

      {/* Why Learn From Our Faculty Section */}
      <section className="w-full py-20 bg-neutral-900/30 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-indigo-400 font-bold text-xs tracking-widest uppercase">
              Mentor Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why Learn From Our Faculty?
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              We select mentors who are not only exceptional musicians but also certified educators skilled at nurturing creativity in every student.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyFaculty.map((item, idx) => (
              <div
                key={idx}
                className="bg-neutral-900/40 border border-neutral-800/80 rounded-3xl p-8 shadow-sm text-left hover:border-neutral-700 hover:shadow-lg transition-all duration-200 backdrop-blur-md"
              >
                <div className="inline-flex p-3 bg-neutral-950 rounded-2xl border border-neutral-800 mb-6">
                  {item.icon}
                </div>
                <h3 className="text-lg font-extrabold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-24 bg-gradient-to-br from-neutral-950 via-neutral-900 to-indigo-950 text-white text-center border-t border-neutral-900 shadow-xl relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-indigo-500/5 rounded-full blur-[130px] -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
          <span className="text-yellow-400 font-bold text-xs uppercase tracking-widest bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
            Book Your Slot
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight pt-2 leading-tight">
            Ready to Learn From the Best?
          </h2>
          <p className="text-neutral-450 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Reserve a trial masterclass with one of our certified music coaches and begin your instrumental lessons today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="/contact"
              className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-yellow-500/20 active:scale-95 group cursor-pointer"
            >
              Enroll Today
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="/courses"
              className="inline-flex items-center justify-center bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-xl border border-white/10 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              Explore Courses
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Instructors;
