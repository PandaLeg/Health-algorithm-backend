import { Inject, Injectable } from '@nestjs/common';
import { IClinicConvenienceRepository } from '../repos/clinic-convenience.repository.interface';

@Injectable()
export class ClinicConvenienceService {
  constructor(
    @Inject('IClinicConvenienceRepository')
    private clinicConvenienceRepo: IClinicConvenienceRepository,
  ) {}

  async create(convenienceId: number, clinicBranchId: string) {
    await this.clinicConvenienceRepo.create({
      convenienceId,
      clinicBranchId,
    });
  }
}
