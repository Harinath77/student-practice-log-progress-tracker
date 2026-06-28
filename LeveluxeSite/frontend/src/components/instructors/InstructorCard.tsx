import React from 'react';
import { Link } from 'react-router-dom';
import type { Instructor } from '../../types/instructor';
import { Award, Languages, Sparkles, Music, ChevronRight } from 'lucide-react';

interface InstructorCardProps {
  instructor: Instructor;
}

const InstructorCard: React.FC<InstructorCardProps> = ({ instructor }) => {
  const { full_name, instrument, qualification, experience_years, bio, languages, specialization } = instructor;

  // Generate initials for profile bubble
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Get matching instrument background gradients
  const getInstrumentGradient = (inst: string) => {
    switch (inst.toLowerCase()) {
      case 'guitar':
        return 'from-amber-900/60 to-neutral-900';
      case 'piano':
        return 'from-indigo-900/60 to-neutral-900';
      case 'keyboard':
        return 'from-violet-900/60 to-neutral-900';
      case 'violin':
        return 'from-red-900/60 to-neutral-900';
      case 'drums':
        return 'from-rose-900/60 to-neutral-900';
      case 'vocal':
      case 'vocals':
        return 'from-emerald-900/60 to-neutral-900';
      default:
        return 'from-indigo-900/60 to-neutral-900';
    }
  };

  return (
    <div className="bg-neutral-900/60 text-white rounded-3xl border border-neutral-800/80 overflow-hidden shadow-md hover:shadow-2xl hover:border-neutral-700 hover:-translate-y-1.5 transition-all duration-300 flex flex-col group text-left backdrop-blur-md">
      
      {/* Profile Header Block - CSS Profile Initials Bubble */}
      <div className={`h-40 bg-gradient-to-br ${getInstrumentGradient(instrument)} flex items-center justify-center relative border-b border-neutral-850/60`}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:1.2rem_1.2rem] opacity-40" />
        
        {/* Glowing Circle Initials Avatar */}
        <div className="h-20 w-20 rounded-full bg-neutral-950/70 border-2 border-yellow-500/30 flex items-center justify-center select-none shadow-xl transform group-hover:scale-105 group-hover:border-yellow-500/60 transition-all duration-300 relative">
          <span className="text-2xl font-extrabold text-yellow-400 tracking-tight">
            {getInitials(full_name)}
          </span>
          <span className="absolute bottom-0 right-0 p-1 bg-yellow-500 rounded-full text-neutral-900 border border-neutral-950">
            <Music className="h-2.5 w-2.5" />
          </span>
        </div>

        {/* Years of Experience overlay badge */}
        <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-neutral-300 border border-neutral-800 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
          {experience_years} Yrs Exp
        </span>
      </div>

      {/* Profile Details */}
      <div className="p-6 flex-grow flex flex-col space-y-4">
        {/* Name and Instrument */}
        <div>
          <h3 className="text-lg font-extrabold tracking-tight text-white group-hover:text-yellow-400 transition-colors duration-200">
            {full_name}
          </h3>
          <p className="text-indigo-400 text-xs font-bold uppercase tracking-wider mt-1 flex items-center space-x-1.5">
            <Music className="h-3 w-3 flex-shrink-0" />
            <span>{instrument} Instructor</span>
          </p>
        </div>

        {/* Bio */}
        <p className="text-neutral-400 text-xs leading-relaxed flex-grow line-clamp-3">
          {bio}
        </p>

        {/* Details & Qualifications lists */}
        <div className="space-y-2.5 pt-3 border-t border-neutral-800/80 text-xs">
          <div className="flex items-start space-x-2 text-neutral-300">
            <Award className="h-4 w-4 text-neutral-500 mt-0.5 flex-shrink-0" />
            <span className="font-semibold leading-normal">{qualification}</span>
          </div>
          <div className="flex items-start space-x-2 text-neutral-300">
            <Sparkles className="h-4 w-4 text-neutral-500 mt-0.5 flex-shrink-0" />
            <span className="text-neutral-400">Spec: <span className="text-neutral-300 font-semibold">{specialization}</span></span>
          </div>
          <div className="flex items-start space-x-2 text-neutral-300">
            <Languages className="h-4 w-4 text-neutral-500 mt-0.5 flex-shrink-0" />
            <span className="text-neutral-400">Langs: <span className="text-neutral-300 font-semibold">{languages}</span></span>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex items-center justify-start space-x-4 pt-2 text-neutral-500 group-hover:text-neutral-450 transition-colors">
          <a href="#social" className="hover:text-yellow-400 transition-colors" aria-label="Facebook">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
          </a>
          <a href="#social" className="hover:text-yellow-400 transition-colors" aria-label="Twitter">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="#social" className="hover:text-yellow-400 transition-colors" aria-label="Instagram">
            <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
          <a href="#social" className="hover:text-yellow-400 transition-colors" aria-label="LinkedIn">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
          </a>
        </div>

        {/* View Profile Action */}
        <Link 
          to={`/instructors/${instructor.id}`}
          className="w-full inline-flex items-center justify-center bg-white/5 hover:bg-yellow-500 hover:text-neutral-900 text-white font-bold py-3 rounded-2xl transition-all duration-200 active:scale-95 group/btn border border-white/5 hover:border-transparent cursor-pointer"
        >
          View Profile
          <ChevronRight className="ml-1.5 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      </div>

    </div>
  );
};

export default InstructorCard;
