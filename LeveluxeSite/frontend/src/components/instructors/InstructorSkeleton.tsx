import React from 'react';

const InstructorSkeleton: React.FC = () => {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden p-2 flex flex-col space-y-4 animate-pulse">
      {/* Avatar Header Block */}
      <div className="h-36 bg-neutral-800 rounded-2xl w-full flex items-center justify-center">
        <div className="h-16 w-16 rounded-full bg-neutral-700" />
      </div>
      
      {/* Bio Blocks */}
      <div className="p-4 space-y-4 flex-grow flex flex-col justify-between">
        <div className="space-y-3">
          <div className="h-5 bg-neutral-800 rounded w-2/3" />
          <div className="h-3 bg-neutral-800 rounded w-1/3" />
          <div className="h-3 bg-neutral-800 rounded w-full mt-2" />
        </div>
        
        {/* Specs Lines */}
        <div className="space-y-2.5 pt-3 border-t border-neutral-800">
          <div className="h-3 bg-neutral-800 rounded w-5/6" />
          <div className="h-3 bg-neutral-800 rounded w-2/3" />
        </div>

        <div className="h-10 bg-neutral-800 rounded-xl w-full mt-6" />
      </div>
    </div>
  );
};

export const InstructorSkeletonList: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
      {[...Array(count)].map((_, i) => (
        <InstructorSkeleton key={i} />
      ))}
    </div>
  );
};

export default InstructorSkeleton;
