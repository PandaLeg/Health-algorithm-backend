import { Controller, Get, Query, UseFilters } from '@nestjs/common';
import { LocationAddressService } from '../services/location-address.service';
import { HttpExceptionFilter } from '../../../exceptions/http-exception.filter';
import { GeneralValidationPipe } from '../../../pipes/general-validation.pipe';
import { QueryLocationDto } from '../dto/query-location.dto';
import { ClinicAddressInfo } from '../interfaces/clinic-address-info,interface';

@Controller('addresses')
export class LocationAddressController {
  constructor(
    private readonly locationAddressService: LocationAddressService,
  ) {}

  @UseFilters(new HttpExceptionFilter())
  @Get('/location')
  async getClinicAddresses(
    @Query(new GeneralValidationPipe()) queryLocationDto: QueryLocationDto,
  ): Promise<ClinicAddressInfo[]> {
    return this.locationAddressService.getClinicAddresses(
      queryLocationDto.clinicId,
      queryLocationDto.city,
    );
  }
}
