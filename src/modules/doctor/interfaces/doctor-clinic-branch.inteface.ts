import { IClinicBranchFullInfo } from '../../clinic/interfaces/clinic-branch-full-info.interface';

export interface IDoctorClinicBranch extends IClinicBranchFullInfo {
  clinicId: string;
  city: string;
  type: string;
}
