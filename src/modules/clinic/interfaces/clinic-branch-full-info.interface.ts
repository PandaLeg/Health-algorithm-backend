import { ScheduleClinic } from './schedule-clinic.interface';

export interface ClinicBranchFullInfo {
  clinicBranchId: string;
  address: string;
  conveniences: { id: number; name: string }[];
  schedule: ScheduleClinic[];
}
