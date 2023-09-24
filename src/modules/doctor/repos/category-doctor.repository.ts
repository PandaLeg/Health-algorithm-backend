import { BaseRepository } from '../../../db/repos/base.repository';
import { CategoryDoctor } from '../models/category-doctor.entity';
import { ICategoryDoctorRepository } from './category-doctor.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CategoryDoctorRepository
  extends BaseRepository<CategoryDoctor>
  implements ICategoryDoctorRepository
{
  constructor(
    @Inject('CATEGORY_DOCTOR_REPOSITORY')
    private categoryDoctorRepo: typeof CategoryDoctor,
  ) {
    super(categoryDoctorRepo);
  }
  findAllWithAttributes(): Promise<CategoryDoctor[]> {
    return this.categoryDoctorRepo.findAll({
      attributes: ['id', 'name'],
    });
  }
}
