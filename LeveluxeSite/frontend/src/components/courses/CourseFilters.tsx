import React from 'react';

interface CourseFiltersProps {
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
  selectedInstrument: string;
  setSelectedInstrument: (instrument: string) => void;
}

const CourseFilters: React.FC<CourseFiltersProps> = ({
  selectedLevel,
  setSelectedLevel,
  selectedInstrument,
  setSelectedInstrument
}) => {
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const instruments = ['All', 'Guitar', 'Piano', 'Keyboard', 'Drums', 'Violin', 'Vocal'];

  return (
    <div className="space-y-6 text-left">
      {/* Level Filters */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
          Difficulty Level
        </h4>
        <div className="flex flex-wrap gap-2.5">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 active:scale-95 ${
                selectedLevel === lvl
                  ? 'bg-yellow-500 text-neutral-900 border-yellow-500 shadow-md shadow-yellow-500/10'
                  : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Instrument Filters */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
          Filter by Instrument
        </h4>
        <div className="flex flex-wrap gap-2.5">
          {instruments.map((inst) => (
            <button
              key={inst}
              onClick={() => setSelectedInstrument(inst)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 active:scale-95 ${
                selectedInstrument === inst
                  ? 'bg-yellow-500 text-neutral-900 border-yellow-500 shadow-md shadow-yellow-500/10'
                  : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white'
              }`}
            >
              {inst}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseFilters;
