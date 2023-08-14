import { Controller, Get, Query, UseFilters } from '@nestjs/common';
import { ClinicBranchService } from '../services/clinic-branch.service';
import { HttpExceptionFilter } from '../../../exceptions/http-exception.filter';
import { GeneralValidationPipe } from '../../../pipes/general-validation.pipe';
import { QueryLocationDto } from '../dto/query-location.dto';
import { ClinicAddressInfo } from '../interfaces/clinic-address-info,interface';

@Controller('clinic-branches')
export class ClinicBranchController {
  constructor(private readonly locationAddressService: ClinicBranchService) {}

  @UseFilters(new HttpExceptionFilter())
  @Get('/addresses')
  async getClinicAddresses(
    @Query(new GeneralValidationPipe()) queryLocationDto: QueryLocationDto,
  ): Promise<ClinicAddressInfo[]> {
    return this.locationAddressService.getClinicAddresses(
      queryLocationDto.clinicId,
      queryLocationDto.city,
    );
  }
}
