import { apiClient } from './apiClient';
import type { Instructor } from '../types/instructor';

export const instructorService = {
  async getAllInstructors(): Promise<Instructor[]> {
    const response = await apiClient.get<Instructor[]>('/instructors');
    return response.data;
  },

  async getInstructorById(id: number): Promise<Instructor> {
    const response = await apiClient.get<Instructor>(`/instructors/${id}`);
    return response.data;
  },
};

