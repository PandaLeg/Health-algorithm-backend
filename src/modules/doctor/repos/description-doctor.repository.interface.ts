import { IBaseRepository } from '../../../db/repos/base.repository.interface';
import { DescriptionDoctor } from '../models/description-doctor.entity';

export interface IDescriptionDoctorRepository
  extends IBaseRepository<DescriptionDoctor> {
}
