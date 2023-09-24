import { Inject, Injectable } from '@nestjs/common';
import { IDoctorLocationRepository } from '../repos/doctor-location.repository.interface';

@Injectable()
export class DoctorLocationService {
  constructor(
    @Inject('IDoctorLocationRepository')
    private doctorLocationRepo: IDoctorLocationRepository,
  ) {}

  async create(doctorId: string, city: string) {
    await this.doctorLocationRepo.create({ doctorId, city });
  }
}
