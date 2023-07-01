import { Inject, Injectable } from '@nestjs/common';
import { LocationAddress } from '../models/location-address.entity';

@Injectable()
export class LocationAddressService {
  constructor(
    @Inject('LOCATION_ADDRESS_REPOSITORY')
    private locationAddressRepo: typeof LocationAddress,
  ) {}

  async createAddress(locationId: string, address: string) {
    await this.locationAddressRepo.create({
      locationId,
      address,
    });
  }
}
