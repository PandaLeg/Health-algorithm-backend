import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClinicLocation } from '../models/clinic-location.entity';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ClinicLocationService {
  constructor(
    @Inject('CLINIC_LOCATION_REPOSITORY')
    private clinicLocationRepo: typeof ClinicLocation,
    @Inject('SEQUELIZE') private sequelize: Sequelize,
  ) {}

  async getByClinicIdAndCity(
    clinicId: string,
    city: string,
  ): Promise<ClinicLocation | null> {
    const location: ClinicLocation | null =
      await this.clinicLocationRepo.findOne({
        where: {
          [Op.and]: [
            { clinicId },
            this.sequelize.where(
              this.sequelize.fn('lower', this.sequelize.col('city')),
              city,
            ),
          ],
        },
      });

    if (!location) {
      throw new InternalServerErrorException();
    }

    return location;
  }

  async createLocation(
    clinicId: string,
    city: string,
  ): Promise<ClinicLocation> {
    return await this.clinicLocationRepo.create({
      clinicId,
      city,
    });
  }
}
