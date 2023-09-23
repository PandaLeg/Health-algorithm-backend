import { BaseRepository } from '../../../db/repos/base.repository';
import { ClinicConvenience } from '../models/clinic-convenience.entity';
import { IClinicConvenienceRepository } from './clinic-convenience.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ClinicConvenienceRepository
  extends BaseRepository<ClinicConvenience>
  implements IClinicConvenienceRepository
{
  constructor(
    @Inject('CLINIC_CONVENIENCE_REPOSITORY')
    private clinicConvenienceRepo: typeof ClinicConvenience,
  ) {
    super(clinicConvenienceRepo);
  }
}
