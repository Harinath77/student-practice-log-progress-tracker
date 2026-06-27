import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Schedule } from '../types/schedule';
import { scheduleService } from '../services/scheduleService';

export const useSchedule = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [todaySchedules, setTodaySchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [selectedInstructor, setSelectedInstructor] = useState<string>('All');
  const [selectedInstrument, setSelectedInstrument] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedBatch, setSelectedBatch] = useState<string>('All');

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await scheduleService.getAllSchedules();
      setSchedules(data);

      try {
        const todayData = await scheduleService.getTodaySchedule();
        setTodaySchedules(todayData);
      } catch (todayErr) {
        console.warn("Failed to fetch today's schedules from API. Computing locally.", todayErr);
        const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const localToday = data.filter(
          (s) => s.day.toLowerCase() === currentDay.toLowerCase()
        );
        setTodaySchedules(localToday);
      }
    } catch (err: any) {
      console.warn("Backend API unavailable. Loading local mock schedule data.", err);
      
      // Load fallback JSON
      try {
        const fallbackData = await import('../data/schedule.json');
        setSchedules(fallbackData.default as Schedule[]);

        const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const localToday = (fallbackData.default as Schedule[]).filter(
          (s) => s.day.toLowerCase() === currentDay.toLowerCase()
        );
        setTodaySchedules(localToday);
      } catch (jsonErr) {
        console.error("Failed to load local schedule fallback data", jsonErr);
      }

      setError('Unable to load schedule.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // Map Course Name to Instrument
  const getInstrument = useCallback((courseName: string): string => {
    const lower = courseName.toLowerCase();
    if (lower.includes('guitar')) return 'Guitar';
    if (lower.includes('piano')) return 'Piano';
    if (lower.includes('keyboard')) return 'Keyboard';
    if (lower.includes('violin')) return 'Violin';
    if (lower.includes('drum')) return 'Drums';
    if (lower.includes('vocal')) return 'Vocal';
    return 'Other';
  }, []);

  // Unique filter options extracted from schedules
  const filterOptions = useMemo(() => {
    const days = new Set<string>();
    const instructors = new Set<string>();
    const instruments = new Set<string>();
    const levels = new Set<string>();
    const batches = new Set<string>();

    schedules.forEach((s) => {
      days.add(s.day);
      instructors.add(s.instructor);
      instruments.add(getInstrument(s.course_name));
      levels.add(s.level);
      batches.add(s.batch);
    });

    // Sort order for days: Mon to Sat/Sun
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const sortedDays = Array.from(days).sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));

    return {
      days: sortedDays,
      instructors: Array.from(instructors).sort(),
      instruments: Array.from(instruments).sort(),
      levels: Array.from(levels).sort(),
      batches: Array.from(batches).sort(),
    };
  }, [schedules, getInstrument]);

  // Filter schedules list based on selection
  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      // 1. Day filter
      if (selectedDay !== 'All' && s.day.toLowerCase() !== selectedDay.toLowerCase()) {
        return false;
      }
      // 2. Instructor filter
      if (selectedInstructor !== 'All' && s.instructor !== selectedInstructor) {
        return false;
      }
      // 3. Instrument filter
      if (selectedInstrument !== 'All' && getInstrument(s.course_name) !== selectedInstrument) {
        return false;
      }
      // 4. Level filter
      if (selectedLevel !== 'All' && s.level.toLowerCase() !== selectedLevel.toLowerCase()) {
        return false;
      }
      // 5. Batch filter
      if (selectedBatch !== 'All' && s.batch.toLowerCase() !== selectedBatch.toLowerCase()) {
        return false;
      }
      // 6. Search matching course_name or instructor
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesCourse = s.course_name.toLowerCase().includes(query);
        const matchesInstructor = s.instructor.toLowerCase().includes(query);
        if (!matchesCourse && !matchesInstructor) {
          return false;
        }
      }
      return true;
    });
  }, [schedules, selectedDay, selectedInstructor, selectedInstrument, selectedLevel, selectedBatch, searchTerm, getInstrument]);

  return {
    schedules: filteredSchedules,
    allSchedules: schedules,
    todaySchedules,
    loading,
    error,
    refresh: fetchSchedules,
    // Filter variables & setters
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
    // Unique list of options for UI dropdowns
    filterOptions,
    getInstrument
  };
};

export default useSchedule;
