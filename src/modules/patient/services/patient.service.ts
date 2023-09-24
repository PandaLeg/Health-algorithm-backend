import { Inject, Injectable } from '@nestjs/common';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { Patient } from '../models/patient.entity';
import { IPatientRepository } from '../repos/patient.repository.interface';

@Injectable()
export class PatientService {
  constructor(
    @Inject('IPatientRepository') private patientRepo: IPatientRepository,
  ) {}

  async getById(id: string): Promise<Patient> {
    return await this.patientRepo.findById(id);
  }

  async createPatient(userId: string, dto: CreatePatientDto) {
    const patient: Patient = this.patientRepo.build(userId, dto);
    await this.patientRepo.create(patient.dataValues);
  }
}
