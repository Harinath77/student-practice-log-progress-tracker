import { apiClient } from './apiClient';
import type { Schedule } from '../types/schedule';

export const scheduleService = {
  async getAllSchedules(): Promise<Schedule[]> {
    const response = await apiClient.get<Schedule[]>('/schedule');
    return response.data;
  },

  async getTodaySchedule(): Promise<Schedule[]> {
    const response = await apiClient.get<Schedule[]>('/schedule/today');
    return response.data;
  },
};
export default scheduleService;
