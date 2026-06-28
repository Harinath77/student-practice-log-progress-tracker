import { apiClient } from './apiClient';

export interface EnrollmentPayload {
  full_name: string;
  email: string;
  phone: string;
  age: number;
  selected_course: string;
  experience_level: string;
  preferred_batch: string;
  message?: string;
}

export interface EnrollmentResponse extends EnrollmentPayload {
  id: number;
  created_at: string;
}

export const enrollmentService = {
  async submitEnrollment(payload: EnrollmentPayload): Promise<EnrollmentResponse> {
    const response = await apiClient.post<EnrollmentResponse>('/enrollments', payload);
    return response.data;
  },
};

export default enrollmentService;
