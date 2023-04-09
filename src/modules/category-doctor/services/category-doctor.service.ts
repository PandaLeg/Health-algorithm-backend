import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CategoryDoctor } from '../models/category-doctor.entity';

@Injectable()
export class CategoryDoctorService {
  constructor(
    @Inject('CATEGORY_DOCTOR_REPOSITORY')
    private categoryDoctorRepo: typeof CategoryDoctor,
  ) {}

  async getCategoryById(id: number) {
    const category: CategoryDoctor | null =
      await this.categoryDoctorRepo.findByPk(id);

    if (!category) {
      throw new InternalServerErrorException('Internal server error');
    }

    return category;
  }
}
