import { IBaseRepository } from '../../../base/repos/base.repository.interface';
import { ClinicDoctor } from '../models/clinic-doctor.entity';

export interface IClinicDoctorRepository extends IBaseRepository<ClinicDoctor> {}
