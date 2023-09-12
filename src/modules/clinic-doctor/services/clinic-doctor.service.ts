import { Inject, Injectable } from '@nestjs/common';
import { IClinicDoctorRepository } from '../repos/clinic-doctor.repository.interface';

@Injectable()
export class ClinicDoctorService {
  constructor(
    @Inject('IClinicDoctorRepository')
    readonly clinicDoctorRepo: IClinicDoctorRepository,
  ) {}

  async create(clinicBranchId: string, doctorId: string) {
    await this.clinicDoctorRepo.create({
      clinicBranchId,
      doctorId,
    });
  }
}
