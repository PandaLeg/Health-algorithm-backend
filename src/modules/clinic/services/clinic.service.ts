import { Inject, Injectable } from '@nestjs/common';
import { Clinic } from '../models/clinic.entity';
import { CreateClinicDto } from '../dto/create-clinic.dto';
import { Sequelize } from 'sequelize-typescript';
import { ClinicInfo } from '../interfaces/clinic-info.interface';
import { QueryTypes } from 'sequelize';
import { ClinicLocationService } from './clinic-location.service';
import { ClinicLocation } from '../models/clinic-location.entity';
import { LocationAddressService } from './location-address.service';
import { ClinicAddressInfo } from '../interfaces/clinic-address-info,interface';
import { LocationAddress } from '../models/location-address.entity';
import { ClinicScheduleService } from './clinic-schedule.service';
import { ClinicAddressDto } from '../dto/clinic-address.dto';

@Injectable()
export class ClinicService {
  constructor(
    @Inject('CLINICS_REPOSITORY') private clinicRepo: typeof Clinic,
    @Inject('SEQUELIZE') private sequelize: Sequelize,
    private readonly clinicLocationService: ClinicLocationService,
    private readonly locationAddressService: LocationAddressService,
    private readonly clinicScheduleService: ClinicScheduleService,
  ) {}

  async getByName(name: string): Promise<Clinic | null> {
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
        const firstAddress = location.addresses[0];

        await this.createAddressAndSchedule(
          clinicLocation.id,
          clinic.userId,
          firstAddress,
        );
      } else {
        for (const address of location.addresses) {
          await this.createAddressAndSchedule(
            clinicLocation.id,
            clinic.userId,
            address,
          );
        }
      }
    }
  }

  async createAddressAndSchedule(
    clinicLocationId: string,
    userId: string,
    address: ClinicAddressDto,
  ) {
    const newAddress = await this.locationAddressService.createAddress(
      clinicLocationId,
      address.name,
    );

    for (const scheduleClinic of address.scheduleClinic) {
      const weekDays: number[] = scheduleClinic.weekDays;

      for (const weekDayId of weekDays) {
        await this.clinicScheduleService.createSchedule(
          userId,
          newAddress.id,
          scheduleClinic,
          weekDayId,
        );
      }
    }
  }

  async getAllByCity(name: string, city: string) {
    const query = `
    SELECT c."userId" as "clinicId", c.name
    FROM clinics as c 
    INNER JOIN users as u on c."userId" = u.id 
    INNER JOIN clinic_locations as cl on c."userId" = cl."clinicId"
    where cl.city = '${city}' and LOWER(c.name) like LOWER('${name}%')
    `;

    const clinics: ClinicInfo[] = await this.sequelize.query<ClinicInfo>(
      query,
      { type: QueryTypes.SELECT },
    );

    return clinics;
  }

  async getAddressesByCityAndClinic(
    clinicId: string,
    city: string,
  ): Promise<ClinicAddressInfo[]> {
    const location: ClinicLocation | null =
      await this.clinicLocationService.getByClinicIdAndCity(clinicId, city);

    const addresses: LocationAddress[] =
      await this.locationAddressService.getAllByLocation(location.id);

    return addresses.map((el): ClinicAddressInfo => {
      return {
        id: el.id,
        address: el.address,
      };
    });
  }
}
