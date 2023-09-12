import { IDoctor } from './doctor.interface';
import { IDoctorClinicBranch } from './doctor-clinic-branch.inteface';

export interface IDoctorClinic {
  doctor: IDoctor;
  clinics: IDoctorClinicBranch[];
}
