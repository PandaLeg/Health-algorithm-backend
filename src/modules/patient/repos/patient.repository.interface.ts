import { IBaseRepository } from '../../../base/repos/base.repository.interface';
import { Patient } from '../models/patient.entity';
import { CreatePatientDto } from '../dto/create-patient.dto';

export interface IPatientRepository extends IBaseRepository<Patient> {
  build(userId: string, dto: CreatePatientDto): Patient;
}
