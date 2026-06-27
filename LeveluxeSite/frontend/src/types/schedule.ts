export interface Schedule {
  id: number;
  course_name: string;
  instructor: string;
  day: string;
  start_time: string;
  end_time: string;
  batch: string;
  level: string;
  room: string;
  available_seats: number;
  created_at: string;
}
