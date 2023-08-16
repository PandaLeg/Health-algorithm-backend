import { Inject, Injectable } from '@nestjs/common';
import { ClinicType } from '../models/clinic-type.entity';

@Injectable()
export class ClinicTypeService {
  constructor(
    @Inject('CLINIC_TYPE_REPOSITORY') private clinicTypeRepo: typeof ClinicType,
  ) {}

  async getAll(): Promise<ClinicType[]> {
    const types: ClinicType[] = await this.clinicTypeRepo.findAll({
      attributes: ['id', 'name'],
    });

    return types;
  }
}
