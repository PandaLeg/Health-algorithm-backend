import { Inject, Injectable } from '@nestjs/common';
import { DescriptionDoctor } from '../models/description-doctor.entity';
import { DescriptionInfoDto } from '../dto/description-info.dto';

@Injectable()
export class DescriptionDoctorService {
  constructor(
    @Inject('DESCRIPTION_DOCTOR_REPOSITORY')
    private descriptionDoctorRepo: typeof DescriptionDoctor,
  ) {}

  async create(doctorId: string, description: DescriptionInfoDto) {
    await this.descriptionDoctorRepo.create({
      doctorId,
      ...description,
    });
  }
}
