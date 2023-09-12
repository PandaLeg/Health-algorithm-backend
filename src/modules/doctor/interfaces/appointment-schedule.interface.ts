import { IScheduleDoctor } from './schedule-doctor.interface';

interface IAppointmentSchedule {
  schedule: IScheduleDoctor[];
}

export interface IAppointmentScheduleFromDoctor extends IAppointmentSchedule {
  clinicBranchId: string;
}

export interface IAppointmentScheduleFromClinic extends IAppointmentSchedule {
  doctorId: string;
  firstName: string;
  lastName: string;
}
