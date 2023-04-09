import { Inject, Injectable } from '@nestjs/common';
import { Doctor } from '../models/doctor.entity';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { CategoryDoctorService } from '../../category-doctor/services/category-doctor.service';
import { CategoryDoctor } from '../../category-doctor/models/category-doctor.entity';
import { SpecialtyService } from '../../specialty/services/specialty.service';
import { SpecialtyCategory } from '../interfaces/specialty-category.interface';
import { Specialty } from '../../specialty/models/specialty.entity';

@Injectable()
export class DoctorService {
  constructor(
    @Inject('DOCTORS_REPOSITORY') private doctorRepo: typeof Doctor,
    private readonly categoryDoctorService: CategoryDoctorService,
    private readonly specialtyService: SpecialtyService,
  ) {}

  buildDoctor(dto: CreateDoctorDto) {
    return this.doctorRepo.build({
      firstName: dto.firstName,
      lastName: dto.lastName,
      surname: dto.surname,
      experience: dto.experience,
    });
  }

  async findSpecialtiesAndCategory(
    categoryId: number,
    specialties: number[],
  ): Promise<SpecialtyCategory> {
    const category: CategoryDoctor =
      await this.categoryDoctorService.getCategoryById(categoryId);

    const parseSpecialties: { id: number }[] = specialties.map(
      (el: number) => ({
        id: el,
      }),
    );

    const specialtiesIds: Specialty[] = await this.specialtyService.getByIds(
      parseSpecialties,
    );

    return {
      specialties: specialtiesIds,
      categoryId: category.id,
    };
  }

  async createDoctor(
    doctor: Doctor,
    userId: string,
    additionalInfoDoctor: SpecialtyCategory,
  ) {
    doctor.userId = userId;
    doctor.categoryId = additionalInfoDoctor.categoryId;

    const specialties: number[] = additionalInfoDoctor.specialties.map(
      (el: Specialty) => el.id,
    );

    await doctor.save();
    await doctor.$set('specialties', specialties);
  }
}
