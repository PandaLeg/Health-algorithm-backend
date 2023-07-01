import { Inject, Injectable } from '@nestjs/common';
import { Clinic } from '../models/clinic.entity';
import { CreateClinicDto } from '../dto/create-clinic.dto';
import { Sequelize } from 'sequelize-typescript';
import { QueryClinic } from '../interfaces/query-clinic.interface';
import { QueryTypes } from 'sequelize';
import { ClinicLocationService } from './clinic-location.service';
import { ClinicLocation } from '../models/clinic-location.entity';
import { LocationAddressService } from './location-address.service';

@Injectable()
export class ClinicService {
  constructor(
    @Inject('CLINICS_REPOSITORY') private clinicRepo: typeof Clinic,
    @Inject('SEQUELIZE') private sequelize: Sequelize,
    private readonly clinicLocationService: ClinicLocationService,
    private readonly locationAddressService: LocationAddressService,
  ) {}

  async getClinicByName(name: string): Promise<Clinic | null> {
    const clinic: Clinic | null = await this.clinicRepo.findOne({
      where: {
        name,
      },
    });

    return clinic;
  }

  async createClinic(userId: string, dto: CreateClinicDto) {
    const clinic: Clinic = await this.clinicRepo.create({
      userId,
      name: dto.name,
    });

    for (const location of dto.locations) {
      const clinicLocation: ClinicLocation =
        await this.clinicLocationService.createLocation(
          clinic.userId,
          location.city,
        );

      if (location.addresses.length === 1) {
        await this.locationAddressService.createAddress(
          clinicLocation.id,
          location.addresses[0],
        );
      } else {
        for (const address of location.addresses) {
          await this.locationAddressService.createAddress(
            clinicLocation.id,
            address,
          );
        }
      }
    }
  }

  async getAllByQuery(name: string, city: string): Promise<QueryClinic[]> {
    const query = `
    select id, name from clinics as c inner join users as u on c.\"userId\" = u.id where u.city = '${city}' and LOWER(c.name) like LOWER('${name}%')
    `;
    const clinics: QueryClinic[] = await this.sequelize.query<QueryClinic>(
      query,
      { type: QueryTypes.SELECT },
    );

    return clinics;
  }
}
