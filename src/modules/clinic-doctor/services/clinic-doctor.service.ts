import { Inject, Injectable } from '@nestjs/common';
import { ClinicDoctor } from '../models/clinic-doctor.entity';

@Injectable()
export class ClinicDoctorService {
  constructor(
    @Inject('CLINIC_DOCTOR_REPOSITORY')
    readonly clinicDoctorRepo: typeof ClinicDoctor,
  ) {}

  async create(clinicBranchId: string, doctorId: string) {
    await this.clinicDoctorRepo.create({
      clinicBranchId,
      doctorId,
    });
  }
}
