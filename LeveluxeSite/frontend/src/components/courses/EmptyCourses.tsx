import React from 'react';
import { HelpCircle, RotateCcw } from 'lucide-react';

interface EmptyCoursesProps {
  onReset: () => void;
}

const EmptyCourses: React.FC<EmptyCoursesProps> = ({ onReset }) => {
  return (
    <div className="py-16 px-6 text-center bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg mx-auto space-y-6 shadow-xl">
      <div className="inline-flex p-5 bg-neutral-800 rounded-full text-yellow-400 border border-neutral-750">
        <HelpCircle className="h-10 w-10" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-extrabold text-white">No Courses Found</h3>
        <p className="text-neutral-400 text-sm max-w-xs mx-auto leading-relaxed">
          We couldn't find any courses matching your search keyword or selected filters.
        </p>
      </div>
      <div>
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-200 active:scale-95 space-x-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
};

export default EmptyCourses;
