import { Inject, Injectable } from '@nestjs/common';
import { Clinic } from '../models/clinic.entity';
import { CreateClinicDto } from '../dto/create-clinic.dto';

@Injectable()
export class ClinicService {
  constructor(
    @Inject('CLINICS_REPOSITORY') private clinicRepo: typeof Clinic,
  ) {}

  async createClinic(userId: string, dto: CreateClinicDto) {
    await this.clinicRepo.create({
      userId,
      ...dto,
    });
  }
}
