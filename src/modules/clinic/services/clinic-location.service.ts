import { Inject, Injectable } from '@nestjs/common';
import { ClinicLocation } from '../models/clinic-location.entity';

@Injectable()
export class ClinicLocationService {
  constructor(
    @Inject('CLINIC_LOCATION_REPOSITORY')
    private clinicLocationRepo: typeof ClinicLocation,
  ) {}

  async createLocation(
    clinicId: string,
    city: string,
  ): Promise<ClinicLocation> {
    return await this.clinicLocationRepo.create({
      clinicId,
      city,
    });
  }
}
