import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Specialty } from '../models/specialty.entity';
import { Op } from 'sequelize';

@Injectable()
export class SpecialtyService {
  constructor(
    @Inject('SPECIALTY_REPOSITORY') private specialtyRepo: typeof Specialty,
  ) {}

  async getByIds(specialties: { id: number }[]) {
    const specialtiesIds: Specialty[] = await this.specialtyRepo.findAll({
      where: {
        [Op.or]: [...specialties],
      },
      attributes: ['id'],
    });

    if (!specialtiesIds.length) {
      throw new InternalServerErrorException('Internal server error');
    }

    return specialtiesIds;
  }
}
