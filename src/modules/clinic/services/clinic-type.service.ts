import { Inject, Injectable } from '@nestjs/common';
import { ClinicType } from '../models/clinic-type.entity';
import { IClinicTypeRepository } from '../repos/clinic-type.repository.interface';

@Injectable()
export class ClinicTypeService {
  constructor(
    @Inject('IClinicTypeRepository')
    private clinicTypeRepo: IClinicTypeRepository,
  ) {}

  async getAll(): Promise<ClinicType[]> {
    return this.clinicTypeRepo.findAllWithAttributes();
  }

  async getById(id: number): Promise<ClinicType> {
    return await this.clinicTypeRepo.findByIdWithAttributes(id);
  }
}
