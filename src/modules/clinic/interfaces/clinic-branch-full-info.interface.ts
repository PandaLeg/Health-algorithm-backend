import { IScheduleClinic } from './schedule-clinic.interface';

export interface IClinicBranchFullInfo {
  clinicBranchId: string;
  address: string;
  conveniences: { id: number; name: string }[];
  schedule: IScheduleClinic[];
}
