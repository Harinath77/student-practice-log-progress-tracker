import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Course } from '../types/course';
import { courseService } from '../services/courseService';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filtering and sorting state variables
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedInstrument, setSelectedInstrument] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('default'); // 'default', 'price-asc', 'price-desc', 'name-asc'

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (err: any) {
      console.warn("Backend API unavailable. Loading local mock course data.", err);
      
      // Load local fallback mock data
      import('../data/courses.json').then((fallbackData) => {
        setCourses(fallbackData.default as Course[]);
      });

      setError('Backend server unavailable. Please start the FastAPI server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Compute filtered, searched, and sorted courses
  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // 1. Filter by Level
    if (selectedLevel !== 'All') {
      result = result.filter(
        (c) => c.level.toLowerCase() === selectedLevel.toLowerCase()
      );
    }

    // 2. Filter by Instrument
    if (selectedInstrument !== 'All') {
      result = result.filter(
        (c) => c.instrument.toLowerCase() === selectedInstrument.toLowerCase()
      );
    }

    // 3. Filter by Search Query (title or instrument matching)
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(term) ||
          c.instrument.toLowerCase().includes(term)
      );
    }

    // 4. Sort Results
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.fees - b.fees);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.fees - a.fees);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [courses, searchTerm, selectedLevel, selectedInstrument, sortBy]);

  return {
    courses: filteredCourses,
    allCourses: courses,
    loading,
    error,
    refresh: fetchCourses,
    searchTerm,
    setSearchTerm,
    selectedLevel,
    setSelectedLevel,
    selectedInstrument,
    setSelectedInstrument,
    sortBy,
    setSortBy,
  };
};
