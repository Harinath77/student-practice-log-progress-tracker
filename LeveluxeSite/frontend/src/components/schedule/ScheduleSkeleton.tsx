import React from 'react';

export const ScheduleSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-12 animate-pulse">
      
      {/* Today's Classes skeleton */}
      <div className="space-y-4">
        <div className="h-6 bg-neutral-800 rounded-md w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="h-5 bg-neutral-800 rounded-md w-32" />
                <div className="h-4 bg-neutral-800 rounded-md w-12" />
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-4 bg-neutral-800 rounded-md w-40" />
                <div className="h-4 bg-neutral-800 rounded-md w-28" />
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-neutral-800/40">
                <div className="h-4 bg-neutral-800 rounded-md w-16" />
                <div className="h-4 bg-neutral-800 rounded-md w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timetable skeleton */}
      <div className="space-y-4">
        <div className="h-6 bg-neutral-800 rounded-md w-48 mb-6" />
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl overflow-hidden p-6">
          <div className="hidden md:grid grid-cols-7 gap-4 pb-4 border-b border-neutral-800">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-4 bg-neutral-800 rounded-md w-16" />
            ))}
          </div>
          <div className="space-y-4 pt-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center py-3 border-b border-neutral-850 last:border-0">
                <div className="h-4 bg-neutral-850 rounded-md w-20" />
                <div className="h-4 bg-neutral-850 rounded-md w-24" />
                <div className="h-4 bg-neutral-850 rounded-md w-32" />
                <div className="h-4 bg-neutral-850 rounded-md w-24" />
                <div className="h-4 bg-neutral-850 rounded-md w-16" />
                <div className="h-4 bg-neutral-850 rounded-md w-24" />
                <div className="h-4 bg-neutral-850 rounded-md w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ScheduleSkeleton;
