import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Instructor } from '../types/instructor';
import { instructorService } from '../services/instructorService';

export const useInstructors = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedInstrument, setSelectedInstrument] = useState<string>('All');

  const fetchInstructors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await instructorService.getAllInstructors();
      setInstructors(data);
    } catch (err: any) {
      console.warn("Backend API unavailable. Loading local mock instructor data.", err);
      
      // Load local fallback mock data
      import('../data/instructors.json').then((fallbackData) => {
        setInstructors(fallbackData.default as Instructor[]);
      });

      setError('Backend server unavailable. Please start the FastAPI server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  // Compute filtered & searched list of instructors
  const filteredInstructors = useMemo(() => {
    let result = [...instructors];

    // 1. Filter by Instrument
    if (selectedInstrument !== 'All') {
      result = result.filter(
        (ins) => ins.instrument.toLowerCase() === selectedInstrument.toLowerCase()
      );
    }

    // 2. Search by Name, Instrument, or Qualification
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (ins) =>
          ins.full_name.toLowerCase().includes(term) ||
          ins.instrument.toLowerCase().includes(term) ||
          ins.qualification.toLowerCase().includes(term)
      );
    }

    return result;
  }, [instructors, searchTerm, selectedInstrument]);

  return {
    instructors: filteredInstructors,
    allInstructors: instructors,
    loading,
    error,
    refresh: fetchInstructors,
    searchTerm,
    setSearchTerm,
    selectedInstrument,
    setSelectedInstrument,
  };
};
