import { IDoctorScheduleDay } from './doctor-schedule-day.interface';

export interface IDoctor {
  userId: string;
  firstName: string;
  lastName: string;
  surname: string;
  price?: number;
  experience: number;
  categoryName: string;
  avatar: string | null;
  specialties: { id: number; name: string }[];
  about?: string;
  education?: string;
  course?: string;
  schedule?: IDoctorScheduleDay[];
}
