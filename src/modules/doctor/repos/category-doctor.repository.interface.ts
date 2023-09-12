import { IBaseRepository } from '../../../base/repos/base.repository.interface';
import { CategoryDoctor } from '../models/category-doctor.entity';

export interface ICategoryDoctorRepository
  extends IBaseRepository<CategoryDoctor> {
  findAllWithAttributes(): Promise<CategoryDoctor[]>;
}
