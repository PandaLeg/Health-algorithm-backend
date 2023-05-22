import { IDoctor } from './doctor.interface';

export interface IDoctorResponse {
  doctors: IDoctor[];
  totalPages: number;
}
