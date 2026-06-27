import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface CourseSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

const CourseSearch: React.FC<CourseSearchProps> = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between w-full">
      {/* Search Input */}
      <div className="relative flex-grow max-w-xl text-left">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-neutral-500">
          <Search className="h-5 w-5" />
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by course name or instrument..."
          className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-neutral-500 transition-colors"
        />
      </div>

      {/* Sorting Dropdown */}
      <div className="flex items-center space-x-3 bg-neutral-900 border border-neutral-800 rounded-2xl px-4 py-3">
        <SlidersHorizontal className="h-4 w-4 text-neutral-500 flex-shrink-0" />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-transparent text-white text-sm font-semibold focus:outline-none cursor-pointer pr-4"
        >
          <option value="default" className="bg-neutral-900 text-white">Sort: Default</option>
          <option value="price-asc" className="bg-neutral-900 text-white">Price: Low to High</option>
          <option value="price-desc" className="bg-neutral-900 text-white">Price: High to Low</option>
          <option value="name-asc" className="bg-neutral-900 text-white">Name: A to Z</option>
        </select>
      </div>
    </div>
  );
};

export default CourseSearch;
