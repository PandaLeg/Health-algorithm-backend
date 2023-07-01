import { Inject, Injectable } from '@nestjs/common';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { Patient } from '../models/patient.entity';

@Injectable()
export class PatientService {
  constructor(
    @Inject('PATIENTS_REPOSITORY') private patientRepo: typeof Patient,
  ) {}

  async createPatient(userId: string, dto: CreatePatientDto) {
    await this.patientRepo.create({
      userId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      city: dto.city,
    });
  }
}
