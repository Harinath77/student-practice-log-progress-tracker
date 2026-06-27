import React from 'react';

interface InstructorFiltersProps {
  selectedInstrument: string;
  setSelectedInstrument: (instrument: string) => void;
}

const InstructorFilters: React.FC<InstructorFiltersProps> = ({
  selectedInstrument,
  setSelectedInstrument,
}) => {
  const instruments = ['All', 'Guitar', 'Piano', 'Keyboard', 'Drums', 'Violin', 'Vocals'];

  return (
    <div className="flex flex-wrap gap-2.5 items-center justify-start text-left">
      {instruments.map((inst) => (
        <button
          key={inst}
          onClick={() => setSelectedInstrument(inst)}
          className={`px-4.5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 active:scale-95 cursor-pointer ${
            selectedInstrument === inst
              ? 'bg-yellow-500 text-neutral-900 border-yellow-500 shadow-md shadow-yellow-500/10 font-bold'
              : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white'
          }`}
        >
          {inst}
        </button>
      ))}
    </div>
  );
};

export default InstructorFilters;
