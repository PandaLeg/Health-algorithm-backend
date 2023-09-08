import { IDoctor } from '../../doctor/interfaces/doctor.interface';

export interface ClinicDoctors {
  doctors: IDoctor[];
  totalPages: number;
}
