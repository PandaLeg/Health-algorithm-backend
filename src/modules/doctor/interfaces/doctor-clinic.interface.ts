import { IDoctor } from './doctor.interface';
import { DoctorClinicBranch } from './doctor-clinic-branch.inteface';

export interface DoctorClinic {
  doctor: IDoctor;
  clinics: DoctorClinicBranch[];
}
