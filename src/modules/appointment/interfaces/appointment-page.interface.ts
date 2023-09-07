import { AppointmentFull } from './appointment-full.interface';

export interface AppointmentPage {
  appointments: AppointmentFull[];
  totalPages: number;
}
