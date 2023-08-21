import { Inject, Injectable } from '@nestjs/common';
import { Specialty } from '../models/specialty.entity';
import { Op } from 'sequelize';
import { DoctorSpecialty } from '../models/doctor-specialty.entity';

@Injectable()
export class SpecialtyService {
  constructor(
    @Inject('SPECIALTY_REPOSITORY') private specialtyRepo: typeof Specialty,
  ) {}

  async getByIds(specialties: { id: number }[]): Promise<Specialty[]> {
    const specialtiesIds: Specialty[] = await this.specialtyRepo.findAll({
      where: {
        [Op.or]: [...specialties],
      },
    });

    return specialtiesIds;
  }

  async findAll(): Promise<Specialty[]> {
    const specialties: Specialty[] = await this.specialtyRepo.findAll({
      attributes: ['id', 'name'],
    });

    return specialties;
  }

  async findAllByDoctorId(doctorId: string): Promise<Specialty[]> {
    const specialties: Specialty[] = await this.specialtyRepo.findAll({
      attributes: ['id', 'name'],
      include: [
        {
          model: DoctorSpecialty,
          attributes: ['doctorId'],
          where: {
            doctorId,
          },
        },
      ],
    });

    return specialties;
  }
}
