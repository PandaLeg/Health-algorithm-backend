import { IAppointmentFull } from './appointment-full.interface';

export interface IAppointmentPage {
  appointments: IAppointmentFull[];
  totalPages: number;
}
