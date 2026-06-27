import React from 'react';
import { CalendarX, RotateCcw } from 'lucide-react';

interface EmptyScheduleProps {
  onReset: () => void;
}

export const EmptySchedule: React.FC<EmptyScheduleProps> = ({ onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-neutral-900/30 border border-neutral-850 rounded-3xl backdrop-blur-md text-center max-w-lg mx-auto">
      <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 mb-6">
        <CalendarX className="h-10 w-10 text-yellow-500" />
      </div>
      
      <h3 className="text-xl font-extrabold text-white mb-2">
        No Schedules Found
      </h3>
      
      <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-6">
        We couldn't find any classes matching your selected filters or search terms. Try widening your filters or resetting them.
      </p>

      <button
        onClick={onReset}
        className="inline-flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold px-6 py-3 rounded-xl transition-all duration-200 shadow-md cursor-pointer active:scale-95 text-sm"
      >
        <RotateCcw className="h-4 w-4" />
        <span>Reset Filters</span>
      </button>
    </div>
  );
};

export default EmptySchedule;
