import { Inject, Injectable } from '@nestjs/common';
import { Specialty } from '../models/specialty.entity';
import { ISpecialtyRepository } from '../repos/specialty.repository.interface';

@Injectable()
export class SpecialtyService {
  constructor(
    @Inject('ISpecialtyRepository') private specialtyRepo: ISpecialtyRepository,
  ) {}

  async getByIds(specialties: { id: number }[]): Promise<Specialty[]> {
    return await this.specialtyRepo.findAllByIds(specialties);
  }

  async findAll(): Promise<Specialty[]> {
    return await this.specialtyRepo.findAllWithAttributes();
  }

  async findAllByDoctorId(doctorId: string): Promise<Specialty[]> {
    return await this.specialtyRepo.findAllByDoctorId(doctorId);
  }
}
