import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClinicLocation } from '../models/clinic-location.entity';
import { IClinicLocationRepository } from '../repos/clinic-location.repository.interface';

@Injectable()
export class ClinicLocationService {
  constructor(
    @Inject('IClinicLocationRepository')
    private clinicLocationRepo: IClinicLocationRepository,
  ) {}

  async getByClinicIdAndCity(
    clinicId: string,
    city: string,
  ): Promise<ClinicLocation | null> {
    const location: ClinicLocation | null =
      await this.clinicLocationRepo.findOneByClinicAndCity(clinicId, city);

    if (!location) {
      throw new InternalServerErrorException();
    }

    return location;
  }

  async getById(id: string): Promise<ClinicLocation> {
    return await this.clinicLocationRepo.findByIdWithAttributes(id);
  }

  async createLocation(
    clinicId: string,
    city: string,
  ): Promise<ClinicLocation> {
    return await this.clinicLocationRepo.create({ clinicId, city });
  }
}
