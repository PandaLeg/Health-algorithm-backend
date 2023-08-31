import { ScheduleDoctor } from './schedule-doctor.interface';

export interface AppointmentSchedule {
  clinicBranchId: string;
  schedule: ScheduleDoctor[];
}
