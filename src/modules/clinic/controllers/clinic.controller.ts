import { Controller, Get, Query, UseFilters } from '@nestjs/common';
import { ClinicService } from '../services/clinic.service';
import { HttpExceptionFilter } from '../../../exceptions/http-exception.filter';
import { ClinicInfo } from '../interfaces/clinic-info.interface';
import { QueryClinicDto } from '../dto/query-clinic.dto';
import { GeneralValidationPipe } from '../../../pipes/general-validation.pipe';
import { ClinicAddressInfo } from '../interfaces/clinic-address-info,interface';
import { QueryLocationDto } from '../dto/query-location.dto';

@Controller('clinics')
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @UseFilters(new HttpExceptionFilter())
  @Get('/by-city')
  async getAllByCity(
    @Query(new GeneralValidationPipe()) queryClinicDto: QueryClinicDto,
  ): Promise<ClinicInfo[]> {
    return this.clinicService.getAllByCity(
      queryClinicDto.name,
      queryClinicDto.city,
    );
  }

  @UseFilters(new HttpExceptionFilter())
  @Get('/addresses')
  async getAllLocations(
    @Query(new GeneralValidationPipe()) queryLocationDto: QueryLocationDto,
  ): Promise<ClinicAddressInfo[]> {
    return this.clinicService.getAddressesByCityAndClinic(
      queryLocationDto.clinicId,
      queryLocationDto.city,
    );
  }
}
