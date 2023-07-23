import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { LocationAddress } from '../models/location-address.entity';

@Injectable()
export class LocationAddressService {
  constructor(
    @Inject('LOCATION_ADDRESS_REPOSITORY')
    private locationAddressRepo: typeof LocationAddress,
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
    await this.locationAddressRepo.create({
      locationId,
      address,
    });
  }
}
