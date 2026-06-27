import React, { useMemo } from 'react';
import type { Schedule } from '../../types/schedule';
import { Clock, User, Armchair, Hourglass, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface TodayClassesProps {
  todaySchedules: Schedule[];
}

export const TodayClasses: React.FC<TodayClassesProps> = ({ todaySchedules }) => {
  const currentDay = useMemo(() => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' });
  }, []);

  const calculateDuration = (start: string, end: string): string => {
    try {
      const parseTime = (timeStr: string) => {
        const parts = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (!parts) return 0;
        let hours = parseInt(parts[1], 10);
        const minutes = parseInt(parts[2], 10);
        const modifier = parts[3].toUpperCase();
        
        if (modifier === 'PM' && hours !== 12) {
          hours += 12;
        }
        if (modifier === 'AM' && hours === 12) {
          hours = 0;
        }
        return hours * 60 + minutes;
      };
      
      const diff = parseTime(end) - parseTime(start);
      if (diff <= 0) return '1.5 hrs';
      const hrs = Math.floor(diff / 60);
      const mins = diff % 60;
      if (mins === 0) return `${hrs} ${hrs === 1 ? 'hr' : 'hrs'}`;
      if (hrs === 0) return `${mins} mins`;
      return `${hrs}h ${mins}m`;
    } catch (e) {
      return '1.5 hrs';
    }
  };

  if (todaySchedules.length === 0) {
    return null; // hide section if no classes today
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 100 } }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
          <span>Today's Classes</span>
          <span className="text-xs font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
            {currentDay}
          </span>
        </h2>
        <p className="text-xs text-neutral-450">
          Showing active programs running today
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {todaySchedules.map((cls) => {
          const duration = calculateDuration(cls.start_time, cls.end_time);
          const isLowSeats = cls.available_seats <= 5;
          
          return (
            <motion.div
              key={cls.id}
              variants={cardVariants}
              className="bg-neutral-900/40 border border-neutral-850 hover:border-neutral-700/80 rounded-2xl p-6 transition-all duration-300 backdrop-blur-md hover:shadow-lg hover:shadow-indigo-500/5 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Course Name & Level Badge */}
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-extrabold text-white group-hover:text-yellow-400 transition-colors line-clamp-2">
                    {cls.course_name}
                  </h3>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider flex-shrink-0 ${
                    cls.level.toLowerCase() === 'advanced'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : cls.level.toLowerCase() === 'intermediate'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'bg-green-500/10 text-green-400 border border-green-500/20'
                  }`}>
                    {cls.level}
                  </span>
                </div>

                {/* Details list */}
                <div className="space-y-2.5 text-xs text-neutral-400">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                    <span>Instructor: <strong className="text-neutral-200">{cls.instructor}</strong></span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                    <span>Time: <strong className="text-neutral-200">{cls.start_time} – {cls.end_time}</strong></span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Hourglass className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                    <span>Duration: <strong className="text-neutral-200">{duration}</strong></span>
                  </div>
                </div>
              </div>

              {/* Bottom footer elements */}
              <div className="flex items-center justify-between pt-4 mt-5 border-t border-neutral-850/60 text-xs">
                <div className="flex items-center space-x-1.5 text-neutral-400">
                  <Star className="h-3.5 w-3.5 text-yellow-500" />
                  <span>{cls.room}</span>
                </div>
                
                <div className="flex items-center space-x-1.5">
                  <Armchair className={`h-4 w-4 ${isLowSeats ? 'text-red-400 animate-pulse' : 'text-neutral-500'}`} />
                  <span className={isLowSeats ? 'text-red-400 font-bold' : 'text-neutral-400'}>
                    {cls.available_seats} {cls.available_seats === 1 ? 'seat' : 'seats'} left
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default TodayClasses;
