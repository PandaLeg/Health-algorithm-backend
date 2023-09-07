import { ScheduleDoctor } from './schedule-doctor.interface';

interface AppointmentSchedule {
  schedule: ScheduleDoctor[];
}

export interface AppointmentScheduleFromDoctor extends AppointmentSchedule {
  clinicBranchId: string;
}

export interface AppointmentScheduleFromClinic extends AppointmentSchedule {
  doctorId: string;
  firstName: string;
  lastName: string;
}
