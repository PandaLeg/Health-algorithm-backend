import { Inject, Injectable } from '@nestjs/common';
import { DescriptionInfoDto } from '../dto/description-info.dto';
import { IDescriptionDoctorRepository } from '../repos/description-doctor.repository.interface';

@Injectable()
export class DescriptionDoctorService {
  constructor(
    @Inject('IDescriptionDoctorRepository')
    private descriptionDoctorRepo: IDescriptionDoctorRepository,
  ) {}

  async create(doctorId: string, description: DescriptionInfoDto) {
    await this.descriptionDoctorRepo.create({
      doctorId,
      ...description,
    });
  }
}
