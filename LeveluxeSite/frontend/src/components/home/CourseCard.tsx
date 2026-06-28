import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, ArrowUpRight, Music, Mic, Keyboard as PianoIcon } from 'lucide-react';

interface CourseCardProps {
  id: number;
  image: string; // Left here for API signature compatibility, unused
  name: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  duration: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ id, name, description, level, duration }) => {
  // Infer instrument from course name
  const getInstrumentFromTitle = (title: string) => {
    if (title.toLowerCase().includes('guitar')) return 'guitar';
    if (title.toLowerCase().includes('piano')) return 'piano';
    if (title.toLowerCase().includes('keyboard')) return 'keyboard';
    if (title.toLowerCase().includes('violin')) return 'violin';
    if (title.toLowerCase().includes('drum')) return 'drums';
    if (title.toLowerCase().includes('vocal')) return 'vocal';
    return 'default';
  };

  const instrument = getInstrumentFromTitle(name);

  // Retrieve an appropriate Lucide icon depending on the instrument
  const getInstrumentIcon = (inst: string) => {
    switch (inst) {
      case 'vocal':
        return <Mic className="h-10 w-10 text-yellow-400" />;
      case 'piano':
      case 'keyboard':
        return <PianoIcon className="h-10 w-10 text-yellow-400" />;
      default:
        return <Music className="h-10 w-10 text-yellow-400" />;
    }
  };

  // Get difficulty level badge colors
  const getLevelBadgeColor = (lvl: string) => {
    switch (lvl.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'intermediate':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'advanced':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
    }
  };

  // Get gradient background depending on instrument
  const getGradientBg = (inst: string) => {
    switch (inst) {
      case 'guitar':
        return 'from-amber-950 via-neutral-900 to-neutral-950';
      case 'piano':
        return 'from-indigo-950 via-neutral-900 to-neutral-950';
      case 'keyboard':
        return 'from-violet-950 via-neutral-900 to-neutral-950';
      case 'violin':
        return 'from-red-950 via-neutral-900 to-neutral-950';
      case 'drums':
        return 'from-rose-950 via-neutral-900 to-neutral-950';
      case 'vocal':
        return 'from-emerald-950 via-neutral-900 to-neutral-950';
      default:
        return 'from-indigo-950 via-neutral-900 to-neutral-950';
    }
  };

  return (
    <div className="bg-neutral-900 text-white rounded-3xl border border-neutral-800 overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group text-left">
      
      {/* Premium CSS Gradient Header */}
      <div className={`relative h-44 bg-gradient-to-br ${getGradientBg(instrument)} flex items-center justify-center border-b border-neutral-850 overflow-hidden`}>
        
        {/* Glow grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />
        
        <div className="relative z-10 p-5 bg-black/35 rounded-2xl border border-white/5 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
          {getInstrumentIcon(instrument)}
        </div>

        {/* Level Badge */}
        <span className={`absolute top-4 left-4 border px-3 py-1 rounded-full text-xs font-bold ${getLevelBadgeColor(level)}`}>
          {level}
        </span>

        {/* Instrument Label */}
        <span className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
          <Music className="h-3 w-3" />
          <span className="capitalize">{instrument}</span>
        </span>
      </div>

      {/* Course Details */}
      <div className="p-6 flex-grow flex flex-col space-y-4">
        <h3 className="text-xl font-extrabold tracking-tight group-hover:text-yellow-400 transition-colors duration-200">
          {name}
        </h3>
        
        <p className="text-neutral-400 text-sm leading-relaxed flex-grow">
          {description}
        </p>

        {/* Metadata */}
        <div className="flex items-center space-x-4 pt-4 border-t border-neutral-850 text-xs font-semibold text-neutral-400">
          <div className="flex items-center space-x-1.5">
            <Clock className="h-4 w-4 text-neutral-500" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <BookOpen className="h-4 w-4 text-neutral-500" />
            <span>Structured syllabus</span>
          </div>
        </div>

        {/* Action Button */}
        <Link 
          to={`/courses/${id}`}
          className="w-full inline-flex items-center justify-center bg-white/5 hover:bg-yellow-500 hover:text-neutral-900 text-white font-bold py-3.5 rounded-2xl transition-all duration-200 active:scale-95 group/btn border border-white/5 hover:border-transparent cursor-pointer"
        >
          Learn More
          <ArrowUpRight className="ml-1.5 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
