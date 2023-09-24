import { BaseRepository } from '../../../db/repos/base.repository';
import { ClinicType } from '../models/clinic-type.entity';
import { IClinicTypeRepository } from './clinic-type.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ClinicTypeRepository
  extends BaseRepository<ClinicType>
  implements IClinicTypeRepository
{
  constructor(
    @Inject('CLINIC_TYPE_REPOSITORY') private clinicTypeRepo: typeof ClinicType,
  ) {
    super(clinicTypeRepo);
  }

  findAllWithAttributes(): Promise<ClinicType[]> {
    return this.clinicTypeRepo.findAll({
      attributes: ['id', 'name'],
    });
  }

  findByIdWithAttributes(id: number): Promise<ClinicType> {
    return this.clinicTypeRepo.findByPk(id, {
      attributes: ['id', 'name'],
    });
  }
}
