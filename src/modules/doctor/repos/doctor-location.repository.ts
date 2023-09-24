import { BaseRepository } from '../../../db/repos/base.repository';
import { DoctorLocation } from '../models/doctor-location.entity';
import { IDoctorLocationRepository } from './doctor-location.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DoctorLocationRepository
  extends BaseRepository<DoctorLocation>
  implements IDoctorLocationRepository
{
  constructor(
    @Inject('DOCTOR_LOCATION_REPOSITORY')
    private doctorLocationRepo: typeof DoctorLocation,
  ) {
    super(doctorLocationRepo);
  }

  createDoctorLocation(
    doctorId: string,
    city: string,
  ): Promise<DoctorLocation> {
    return this.doctorLocationRepo.create({
      doctorId,
      city,
    });
  }
}
