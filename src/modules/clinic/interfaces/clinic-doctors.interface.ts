import { IDoctor } from '../../doctor/interfaces/doctor.interface';

export interface IClinicDoctors {
  doctors: IDoctor[];
  totalPages: number;
}
