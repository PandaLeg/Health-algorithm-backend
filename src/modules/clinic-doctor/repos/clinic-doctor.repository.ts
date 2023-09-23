import { BaseRepository } from '../../../db/repos/base.repository';
import { ClinicDoctor } from '../models/clinic-doctor.entity';
import { IClinicDoctorRepository } from './clinic-doctor.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ClinicDoctorRepository
  extends BaseRepository<ClinicDoctor>
  implements IClinicDoctorRepository
{
  constructor(
    @Inject('CLINIC_DOCTOR_REPOSITORY')
    readonly clinicDoctorRepo: typeof ClinicDoctor,
  ) {
    super(clinicDoctorRepo);
  }
}
