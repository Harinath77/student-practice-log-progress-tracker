import React from 'react';
import { Search, Calendar, User, Music, BarChart, Clock } from 'lucide-react';

interface ScheduleFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedDay: string;
  setSelectedDay: (day: string) => void;
  selectedInstructor: string;
  setSelectedInstructor: (instructor: string) => void;
  selectedInstrument: string;
  setSelectedInstrument: (instrument: string) => void;
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
  selectedBatch: string;
  setSelectedBatch: (batch: string) => void;
  filterOptions: {
    days: string[];
    instructors: string[];
    instruments: string[];
    levels: string[];
    batches: string[];
  };
}

export const ScheduleFilters: React.FC<ScheduleFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedDay,
  setSelectedDay,
  selectedInstructor,
  setSelectedInstructor,
  selectedInstrument,
  setSelectedInstrument,
  selectedLevel,
  setSelectedLevel,
  selectedBatch,
  setSelectedBatch,
  filterOptions,
}) => {
  return (
    <div className="bg-neutral-900/40 border border-neutral-850 p-6 rounded-3xl backdrop-blur-md space-y-6 text-left">
      
      {/* Top Section: Search Input */}
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-neutral-500">
          <Search className="h-5 w-5" />
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by course name or instructor..."
          className="w-full bg-neutral-950/80 border border-neutral-800 text-white rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 placeholder-neutral-500 transition-all"
        />
      </div>

      {/* Bottom Section: Dropdowns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        
        {/* Day Select */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider flex items-center space-x-1">
            <Calendar className="h-3.5 w-3.5 text-yellow-500/80" />
            <span>Day</span>
          </label>
          <div className="relative">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full bg-neutral-950/60 border border-neutral-800 text-neutral-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-yellow-500 appearance-none cursor-pointer"
            >
              <option value="All">All Days</option>
              {filterOptions.days.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-500 text-xs">▼</span>
          </div>
        </div>

        {/* Instructor Select */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider flex items-center space-x-1">
            <User className="h-3.5 w-3.5 text-yellow-500/80" />
            <span>Instructor</span>
          </label>
          <div className="relative">
            <select
              value={selectedInstructor}
              onChange={(e) => setSelectedInstructor(e.target.value)}
              className="w-full bg-neutral-950/60 border border-neutral-800 text-neutral-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-yellow-500 appearance-none cursor-pointer"
            >
              <option value="All">All Instructors</option>
              {filterOptions.instructors.map((inst) => (
                <option key={inst} value={inst}>{inst}</option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-500 text-xs">▼</span>
          </div>
        </div>

        {/* Instrument Select */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider flex items-center space-x-1">
            <Music className="h-3.5 w-3.5 text-yellow-500/80" />
            <span>Instrument</span>
          </label>
          <div className="relative">
            <select
              value={selectedInstrument}
              onChange={(e) => setSelectedInstrument(e.target.value)}
              className="w-full bg-neutral-950/60 border border-neutral-800 text-neutral-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-yellow-500 appearance-none cursor-pointer"
            >
              <option value="All">All Instruments</option>
              {filterOptions.instruments.map((inst) => (
                <option key={inst} value={inst}>{inst}</option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-500 text-xs">▼</span>
          </div>
        </div>

        {/* Level Select */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider flex items-center space-x-1">
            <BarChart className="h-3.5 w-3.5 text-yellow-500/80" />
            <span>Level</span>
          </label>
          <div className="relative">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full bg-neutral-950/60 border border-neutral-800 text-neutral-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-yellow-500 appearance-none cursor-pointer"
            >
              <option value="All">All Levels</option>
              {filterOptions.levels.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-500 text-xs">▼</span>
          </div>
        </div>

        {/* Batch Select */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider flex items-center space-x-1">
            <Clock className="h-3.5 w-3.5 text-yellow-500/80" />
            <span>Batch</span>
          </label>
          <div className="relative">
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full bg-neutral-950/60 border border-neutral-800 text-neutral-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-yellow-500 appearance-none cursor-pointer"
            >
              <option value="All">All Batches</option>
              {filterOptions.batches.map((batch) => (
                <option key={batch} value={batch}>{batch}</option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-500 text-xs">▼</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ScheduleFilters;
