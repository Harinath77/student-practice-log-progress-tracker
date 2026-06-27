import React from 'react';
import { Search } from 'lucide-react';

interface InstructorSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const InstructorSearch: React.FC<InstructorSearchProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative flex-grow max-w-md w-full text-left">
      <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-neutral-500">
        <Search className="h-5 w-5" />
      </span>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by instructor name, instrument, degree..."
        className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-neutral-500 transition-colors"
      />
    </div>
  );
};

export default InstructorSearch;
