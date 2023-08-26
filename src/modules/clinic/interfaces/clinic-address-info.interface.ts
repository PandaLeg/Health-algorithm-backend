import { BranchSchedule } from './branch-schedule.interface';

export interface ClinicAddressInfo {
  id: string;
  address: string;
  days: { id: number; name: string }[];
  schedule: BranchSchedule[];
}
