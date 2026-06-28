import React from 'react';
import type { Schedule } from '../../types/schedule';
import { Calendar, Clock, User, MapPin, Armchair } from 'lucide-react';

interface WeeklyScheduleTableProps {
  schedules: Schedule[];
  onEnroll?: (schedule: Schedule) => void;
}

export const WeeklyScheduleTable: React.FC<WeeklyScheduleTableProps> = ({ schedules, onEnroll }) => {
  return (
    <div className="w-full text-left">
      
      {/* Desktop Timetable: Professional Table (hidden on mobile) */}
      <div className="hidden lg:block overflow-hidden bg-neutral-900/40 border border-neutral-850 rounded-3xl backdrop-blur-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-neutral-850 bg-neutral-950/60">
              <th className="px-6 py-5 text-xs font-bold text-neutral-400 uppercase tracking-widest text-left">Day</th>
              <th className="px-6 py-5 text-xs font-bold text-neutral-400 uppercase tracking-widest text-left">Time</th>
              <th className="px-6 py-5 text-xs font-bold text-neutral-400 uppercase tracking-widest text-left">Course</th>
              <th className="px-6 py-5 text-xs font-bold text-neutral-400 uppercase tracking-widest text-left">Instructor</th>
              <th className="px-6 py-5 text-xs font-bold text-neutral-400 uppercase tracking-widest text-left">Level</th>
              <th className="px-6 py-5 text-xs font-bold text-neutral-400 uppercase tracking-widest text-left">Batch</th>
              <th className="px-6 py-5 text-xs font-bold text-neutral-400 uppercase tracking-widest text-left">Room</th>
              <th className="px-6 py-5 text-xs font-bold text-neutral-400 uppercase tracking-widest text-right">Seats</th>
              <th className="px-6 py-5 text-xs font-bold text-neutral-400 uppercase tracking-widest text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-850/50">
            {schedules.map((row) => {
              const isLowSeats = row.available_seats <= 5;
              
              return (
                <tr 
                  key={row.id}
                  className="hover:bg-neutral-900/40 transition-colors duration-150 group"
                >
                  <td className="px-6 py-5.5 text-sm font-semibold text-white">
                    {row.day}
                  </td>
                  <td className="px-6 py-5.5 text-sm text-neutral-300">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-neutral-500 group-hover:text-yellow-500 transition-colors" />
                      <span>{row.start_time} – {row.end_time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5.5 text-sm font-bold text-white group-hover:text-yellow-400 transition-colors">
                    {row.course_name}
                  </td>
                  <td className="px-6 py-5.5 text-sm text-neutral-300">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-neutral-500" />
                      <span>{row.instructor}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5.5 text-sm">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      row.level.toLowerCase() === 'advanced'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : row.level.toLowerCase() === 'intermediate'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-green-500/10 text-green-400 border border-green-500/20'
                    }`}>
                      {row.level}
                    </span>
                  </td>
                  <td className="px-6 py-5.5 text-sm text-neutral-300">
                    <span className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                      {row.batch}
                    </span>
                  </td>
                  <td className="px-6 py-5.5 text-sm text-neutral-300">
                    <div className="flex items-center space-x-1.5 text-neutral-450">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{row.room}</span>
                    </div>
                  </td>
                  <td className={`px-6 py-5.5 text-sm text-right font-medium ${
                    isLowSeats ? 'text-red-400 font-bold' : 'text-neutral-400'
                  }`}>
                    {row.available_seats} Left
                  </td>
                  <td className="px-6 py-5.5 text-sm text-right">
                    <button 
                      onClick={() => onEnroll && onEnroll(row)}
                      className="text-xs font-bold text-yellow-400 hover:text-neutral-900 border border-yellow-500/20 hover:border-transparent hover:bg-yellow-500 bg-yellow-500/5 px-3 py-1.5 rounded-xl transition-all cursor-pointer active:scale-95"
                    >
                      Enroll
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Timetable: Cards list (hidden on desktop) */}
      <div className="lg:hidden space-y-4">
        {schedules.map((row) => {
          const isLowSeats = row.available_seats <= 5;
          
          return (
            <div
              key={row.id}
              className="bg-neutral-900/40 border border-neutral-850 hover:border-neutral-750 rounded-2xl p-5 space-y-4 transition-all duration-200"
            >
              {/* Day & Batch Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-semibold text-yellow-400">
                  <Calendar className="h-4 w-4" />
                  <span>{row.day}</span>
                </div>
                <span className="text-[10px] bg-white/5 border border-white/10 px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold text-neutral-400">
                  {row.batch}
                </span>
              </div>

              {/* Course Title & Level */}
              <div className="space-y-1">
                <h4 className="font-extrabold text-white text-base">
                  {row.course_name}
                </h4>
                <div className="flex items-center space-x-2.5">
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    row.level.toLowerCase() === 'advanced'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : row.level.toLowerCase() === 'intermediate'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'bg-green-500/10 text-green-400 border border-green-500/20'
                  }`}>
                    {row.level}
                  </span>
                  <span className="text-[10px] text-neutral-500 flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{row.room}</span>
                  </span>
                </div>
              </div>

              {/* Instructor & Timings details */}
              <div className="grid grid-cols-2 gap-3 text-xs border-t border-neutral-850/60 pt-3">
                <div className="space-y-1">
                  <span className="text-neutral-500 font-medium">Instructor</span>
                  <div className="flex items-center space-x-1.5 text-neutral-200">
                    <User className="h-3.5 w-3.5 text-neutral-500" />
                    <span>{row.instructor}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-neutral-500 font-medium">Class Timing</span>
                  <div className="flex items-center space-x-1.5 text-neutral-200">
                    <Clock className="h-3.5 w-3.5 text-neutral-500" />
                    <span>{row.start_time} – {row.end_time}</span>
                  </div>
                </div>
              </div>

              {/* Seat reservation */}
              <div className="flex items-center justify-between border-t border-neutral-850/60 pt-3 text-xs pb-1">
                <div className="flex items-center space-x-1.5">
                  <Armchair className={`h-3.5 w-3.5 ${isLowSeats ? 'text-red-400' : 'text-neutral-500'}`} />
                  <span className={isLowSeats ? 'text-red-400 font-bold' : 'text-neutral-400'}>
                    Available Seats
                  </span>
                </div>
                <span className={`font-bold ${isLowSeats ? 'text-red-400' : 'text-white'}`}>
                  {row.available_seats} Slots left
                </span>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => onEnroll && onEnroll(row)}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold py-2.5 rounded-xl transition-all cursor-pointer text-xs active:scale-95 text-center block mt-2"
              >
                Enroll in Slot
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default WeeklyScheduleTable;
