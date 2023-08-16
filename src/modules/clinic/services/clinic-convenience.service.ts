import { Inject, Injectable } from '@nestjs/common';
import { ClinicConvenience } from '../models/clinic-convenience.entity';

@Injectable()
export class ClinicConvenienceService {
  constructor(
    @Inject('CLINIC_CONVENIENCE_REPOSITORY')
    private clinicConvenienceRepo: typeof ClinicConvenience,
  ) {}

  async create(convenienceId: number, clinicBranchId: string) {
    await this.clinicConvenienceRepo.create({
      convenienceId,
      clinicBranchId,
    });
  }
}
