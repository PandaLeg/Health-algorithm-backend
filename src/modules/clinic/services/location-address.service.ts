import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { LocationAddress } from '../models/location-address.entity';
import { ClinicAddressInfo } from '../interfaces/clinic-address-info,interface';
import { ClinicLocation } from '../models/clinic-location.entity';
import { ClinicLocationService } from './clinic-location.service';
import { ClinicSchedule } from '../models/clinic-schedule.entity';
import { Op } from 'sequelize';

@Injectable()
export class LocationAddressService {
  constructor(
    @Inject('LOCATION_ADDRESS_REPOSITORY')
    private locationAddressRepo: typeof LocationAddress,
    private readonly clinicLocationService: ClinicLocationService,
  ) {}

  async getAllByLocation(locationId: string) {
    const addresses: LocationAddress[] = await this.locationAddressRepo.findAll(
      {
        where: {
          locationId,
        },
      },
    );

    if (!addresses.length) {
      throw new InternalServerErrorException();
    }

    return addresses;
  }

  async getByIdWithSchedule(id: string): Promise<LocationAddress> {
    const address: LocationAddress = await this.locationAddressRepo.findByPk(
      id,
      {
        include: [
          {
            model: ClinicSchedule,
            attributes: ['dayType', 'from', 'to', 'weekDayId'],
          },
        ],
      },
    );

    if (!address) {
      throw new InternalServerErrorException();
    }

    return address;
  }

  async getFirstByLocation(locationId: string) {
    const address: LocationAddress | null =
      await this.locationAddressRepo.findOne({
        where: {
          locationId,
        },
      });

    if (!address) {
      throw new InternalServerErrorException();
    }

    return address;
  }

  async createAddress(locationId: string, address: string) {
    return await this.locationAddressRepo.create({
      locationId,
      address,
    });
  }

  async getClinicAddresses(
    clinicId: string,
    city: string,
  ): Promise<ClinicAddressInfo[]> {
    const location: ClinicLocation | null =
      await this.clinicLocationService.getByClinicIdAndCity(clinicId, city);

    const addresses: LocationAddress[] = await this.getAllByLocation(
      location.id,
    );

    return addresses.map((el): ClinicAddressInfo => {
      return {
        id: el.id,
        address: el.address,
      };
    });
  }

  async getAllByLocationWithSchedule(
    locationId: string,
    addressId: string,
    page: number,
    perPage: number,
  ) {
    const addresses = await this.locationAddressRepo.findAndCountAll({
      limit: perPage,
      offset: page,
      distinct: true,
      order: [['id', 'DESC']],
      where: {
        [Op.and]: [
          { locationId },
          {
            [Op.not]: [{ id: addressId }],
          },
        ],
      },
      include: [
        {
          model: ClinicSchedule,
          attributes: ['dayType', 'from', 'to', 'weekDayId'],
        },
      ],
    });

    if (!addresses) {
      throw new InternalServerErrorException();
    }

    return addresses;
  }
}
