import { Inject, Injectable } from '@nestjs/common';
import { DoctorLocation } from '../models/doctor-location.entity';

@Injectable()
export class DoctorLocationService {
  constructor(
    @Inject('DOCTOR_LOCATION_REPOSITORY')
    private doctorLocationRepo: typeof DoctorLocation,
  ) {}

  async create(doctorId: string, city: string) {
    await this.doctorLocationRepo.create({
      doctorId,
      city,
    });
  }
}
