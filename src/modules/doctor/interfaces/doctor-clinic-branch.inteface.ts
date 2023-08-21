import { ClinicBranchFullInfo } from '../../clinic/interfaces/clinic-branch-full-info.interface';

export interface DoctorClinicBranch extends ClinicBranchFullInfo {
  clinicId: string;
  city: string;
  type: string;
}
