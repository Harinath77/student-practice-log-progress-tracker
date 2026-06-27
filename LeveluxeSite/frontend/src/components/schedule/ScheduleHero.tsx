import React from 'react';

export const ScheduleHero: React.FC = () => {
  return (
    <div className="relative w-full py-24 bg-gradient-to-br from-neutral-950 via-neutral-900 to-indigo-950 text-white text-center pt-28 border-b border-neutral-900 overflow-hidden">
      {/* Background glow overlay */}
      <div className="absolute inset-0 bg-indigo-500/5 rounded-3xl blur-[120px]" />
      
      <div className="relative z-10 space-y-4 max-w-3xl mx-auto px-4">
        <span className="text-yellow-400 font-bold text-xs uppercase tracking-widest bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
          Academy Timings
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight">
          Class Schedule & Batch Timings
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mt-2">
          Choose the perfect class timing that fits your daily routine. Explore slots across all instruments and skill levels.
        </p>
      </div>
    </div>
  );
};

export default ScheduleHero;
