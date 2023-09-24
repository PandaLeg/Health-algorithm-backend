import { BaseRepository } from '../../../db/repos/base.repository';
import { ClinicLocation } from '../models/clinic-location.entity';
import { IClinicLocationRepository } from './clinic-location.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { ClinicBranch } from '../models/clinic-branch.entity';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ClinicLocationRepository
  extends BaseRepository<ClinicLocation>
  implements IClinicLocationRepository
{
  constructor(
    @Inject('CLINIC_LOCATION_REPOSITORY')
    private clinicLocationRepo: typeof ClinicLocation,
    @Inject('SEQUELIZE') private sequelize: Sequelize,
  ) {
    super(clinicLocationRepo);
  }

  findByIdWithAttributes(id: string): Promise<ClinicLocation> {
    return this.clinicLocationRepo.findByPk(id, {
      attributes: ['city'],
    });
  }

  findOneByClinicAndCity(
    clinicId: string,
    city: string,
  ): Promise<ClinicLocation> {
    return this.clinicLocationRepo.findOne({
      where: {
        [Op.and]: [
          { clinicId },
          this.sequelize.where(
            this.sequelize.fn('lower', this.sequelize.col('city')),
            city.toLowerCase(),
          ),
        ],
      },
      include: [{ model: ClinicBranch, attributes: ['id'] }],
    });
  }
}
