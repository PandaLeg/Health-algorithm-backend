import { BaseRepository } from '../../../db/repos/base.repository';
import { Specialty } from '../models/specialty.entity';
import { ISpecialtyRepository } from './specialty.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { DoctorSpecialty } from '../models/doctor-specialty.entity';
import { Op } from 'sequelize';

@Injectable()
export class SpecialtyRepository
  extends BaseRepository<Specialty>
  implements ISpecialtyRepository
{
  constructor(
    @Inject('SPECIALTY_REPOSITORY') private specialtyRepo: typeof Specialty,
  ) {
    super(specialtyRepo);
  }

  findAllByDoctorId(doctorId: string): Promise<Specialty[]> {
    return this.specialtyRepo.findAll({
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
  }

  findAllByIds(specialties: { id: number }[]): Promise<Specialty[]> {
    return this.specialtyRepo.findAll({
      where: {
        [Op.or]: [...specialties],
      },
    });
  }

  findAllWithAttributes(): Promise<Specialty[]> {
    return this.specialtyRepo.findAll({
      attributes: ['id', 'name'],
    });
  }
}
