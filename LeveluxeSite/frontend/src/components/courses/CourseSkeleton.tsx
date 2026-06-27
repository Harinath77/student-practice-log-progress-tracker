import React from 'react';

const CourseSkeleton: React.FC = () => {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden p-2 flex flex-col space-y-4 animate-pulse">
      {/* Image Block */}
      <div className="h-48 bg-neutral-800 rounded-2xl w-full" />
      
      {/* Details Block */}
      <div className="p-4 space-y-4 flex-grow flex flex-col">
        <div className="h-5 bg-neutral-800 rounded w-2/3" />
        <div className="space-y-2 flex-grow">
          <div className="h-3 bg-neutral-800 rounded w-full" />
          <div className="h-3 bg-neutral-800 rounded w-5/6" />
        </div>
        <div className="h-6 bg-neutral-800 rounded w-1/4 pt-1" />
        <div className="h-10 bg-neutral-800 rounded-xl w-full mt-4" />
      </div>
    </div>
  );
};

export const CourseSkeletonList: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(count)].map((_, i) => (
        <CourseSkeleton key={i} />
      ))}
    </div>
  );
};

export default CourseSkeleton;
