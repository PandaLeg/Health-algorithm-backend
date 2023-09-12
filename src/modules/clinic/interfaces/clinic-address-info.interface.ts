import { IBranchSchedule } from './branch-schedule.interface';

export interface IClinicAddressInfo {
  id: string;
  address: string;
  days: { id: number; name: string }[];
  schedule: IBranchSchedule[];
}
