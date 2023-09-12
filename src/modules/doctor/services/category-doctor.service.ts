import { Inject, Injectable } from '@nestjs/common';
import { CategoryDoctor } from '../models/category-doctor.entity';
import { ICategoryDoctorRepository } from '../repos/category-doctor.repository.interface';

@Injectable()
export class CategoryDoctorService {
  constructor(
    @Inject('ICategoryDoctorRepository')
    private categoryDoctorRepo: ICategoryDoctorRepository,
  ) {}

  async getCategoryById(id: number): Promise<CategoryDoctor> {
    return await this.categoryDoctorRepo.findById(id);
  }

  async findAll(): Promise<CategoryDoctor[]> {
    return await this.categoryDoctorRepo.findAllWithAttributes();
  }
}
