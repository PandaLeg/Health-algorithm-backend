import { Inject, Injectable } from '@nestjs/common';
import { ClinicDoctor } from '../models/clinic-doctor.entity';

@Injectable()
export class ClinicDoctorService {
  constructor(
    @Inject('CLINIC_DOCTOR_REPOSITORY')
    readonly clinicDoctorRepo: typeof ClinicDoctor,
  ) {}

  async create(clinicId: string, doctorId: string, addressId: string) {
    await this.clinicDoctorRepo.create({
      clinicId,
      doctorId,
      addressId,
    });
  }
}
