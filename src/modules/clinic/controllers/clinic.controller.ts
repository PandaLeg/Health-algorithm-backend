import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseFilters,
} from '@nestjs/common';
import { ClinicService } from '../services/clinic.service';
import { HttpExceptionFilter } from '../../../exceptions/http-exception.filter';
import { ClinicInfo } from '../interfaces/clinic-info.interface';
import { QueryClinicDto } from '../dto/query-clinic.dto';
import { GeneralValidationPipe } from '../../../pipes/general-validation.pipe';
import { ClinicByCityPage } from '../interfaces/clinic-by-city-page.interface';
import { ClinicByCity } from '../interfaces/clinic-by-city.interface';

@Controller('clinics')
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @UseFilters(new HttpExceptionFilter())
  @Get('/names')
  async getAllByCityAndName(
    @Query(new GeneralValidationPipe()) queryClinicDto: QueryClinicDto,
  ): Promise<ClinicInfo[]> {
    return this.clinicService.getAllByCityAndName(
      queryClinicDto.name,
      queryClinicDto.city,
    );
  }

  @UseFilters(new HttpExceptionFilter())
  @Get('/card-info')
  async getAllByCity(
    @Query('city') city: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('perPage', ParseIntPipe) perPage: number,
  ): Promise<ClinicByCityPage> {
    return this.clinicService.getAllByCity(page, perPage, city);
  }

  @UseFilters(new HttpExceptionFilter())
  @Get('/:id/card-info')
  async getByCityAndName(
    @Param('id') id: string,
    @Query('city') city: string,
  ): Promise<ClinicByCity> {
    return this.clinicService.getByIdAndCity(id, city);
  }
}
