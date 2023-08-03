import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { LocationAddress } from '../models/location-address.entity';
import { ClinicAddressInfo } from '../interfaces/clinic-address-info,interface';
import { ClinicLocation } from '../models/clinic-location.entity';
import { ClinicLocationService } from './clinic-location.service';

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
}
