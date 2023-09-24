import { BaseRepository } from '../../../db/repos/base.repository';
import { Patient } from '../models/patient.entity';
import { IPatientRepository } from './patient.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { CreatePatientDto } from '../dto/create-patient.dto';

@Injectable()
export class PatientRepository
  extends BaseRepository<Patient>
  implements IPatientRepository
{
  constructor(
    @Inject('PATIENTS_REPOSITORY') private patientRepo: typeof Patient,
  ) {
    super(patientRepo);
  }

  build(userId: string, dto: CreatePatientDto): Patient {
    return this.patientRepo.build({ userId, ...dto });
  }
}
