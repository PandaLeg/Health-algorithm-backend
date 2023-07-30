import { Controller, Get, Param, ParseIntPipe, Query, UseFilters } from '@nestjs/common';
import { ClinicService } from '../services/clinic.service';
import { HttpExceptionFilter } from '../../../exceptions/http-exception.filter';
import { ClinicInfo } from '../interfaces/clinic-info.interface';
import { QueryClinicDto } from '../dto/query-clinic.dto';
import { GeneralValidationPipe } from '../../../pipes/general-validation.pipe';
import { ClinicAddressInfo } from '../interfaces/clinic-address-info,interface';
import { QueryLocationDto } from '../dto/query-location.dto';
import { ClinicByCityResponse } from '../interfaces/clinic-by-city-response.interface';

@Controller('clinics')
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @UseFilters(new HttpExceptionFilter())
  @Get('/:city')
  async getAllByCity(
    @Param('city') city: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('perPage', ParseIntPipe) perPage: number,
  ): Promise<ClinicByCityResponse> {
    return this.clinicService.getAllByCity(page, perPage, city);
  }

  @UseFilters(new HttpExceptionFilter())
  @Get('/by-city-and-name')
  async getAllByCityAndName(
    @Query(new GeneralValidationPipe()) queryClinicDto: QueryClinicDto,
  ): Promise<ClinicInfo[]> {
    return this.clinicService.getAllByCityAndName(
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
