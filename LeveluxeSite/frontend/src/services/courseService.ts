import { apiClient } from './apiClient';
import type { Course } from '../types/course';

export const courseService = {
  async getAllCourses(): Promise<Course[]> {
    const response = await apiClient.get<Course[]>('/courses');
    return response.data;
  },

  async getCourseById(id: number): Promise<Course> {
    const response = await apiClient.get<Course>(`/courses/${id}`);
    return response.data;
  },
};

