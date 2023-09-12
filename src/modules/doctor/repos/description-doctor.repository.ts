import { BaseRepository } from '../../../base/repos/base.repository';
import { DescriptionDoctor } from '../models/description-doctor.entity';
import { IDescriptionDoctorRepository } from './description-doctor.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DescriptionDoctorRepository
  extends BaseRepository<DescriptionDoctor>
  implements IDescriptionDoctorRepository
{
  constructor(
    @Inject('DESCRIPTION_DOCTOR_REPOSITORY')
    private descriptionDoctorRepo: typeof DescriptionDoctor,
  ) {
    super(descriptionDoctorRepo);
  }
}
