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
import { ClinicCardInfoPage } from '../interfaces/clinic-card-info-page.interface';
import { ClinicCardInfo } from '../interfaces/clinic-card-info.interface';
import { ClinicFullInfo } from '../interfaces/clinic-full-info.interface';

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
  ): Promise<ClinicCardInfoPage> {
    return this.clinicService.getAllByCity(page, perPage, city);
  }

  @UseFilters(new HttpExceptionFilter())
  @Get('/full-info')
  async getFullInfoClinics(
    @Query('id') id: string,
    @Query('city') city: string,
    @Query('clinicBranch') clinicBranchId: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('perPage', ParseIntPipe) perPage: number,
  ) {
    return this.clinicService.getFullInfoClinics(
      id,
      city,
      clinicBranchId,
      page,
      perPage,
    );
  }

  @UseFilters(new HttpExceptionFilter())
  @Get('/:id/card-info')
  async getByCityAndName(
    @Param('id') id: string,
    @Query('city') city: string,
  ): Promise<ClinicCardInfo> {
    return this.clinicService.getByIdAndCity(id, city);
  }

  @UseFilters(new HttpExceptionFilter())
  @Get('/:id/full-info')
  async getFullInfoClinic(
    @Param('id') id: string,
    @Query('city') city: string,
    @Query('clinicBranch') clinicBranchId: string,
  ): Promise<ClinicFullInfo> {
    return this.clinicService.getFullInfoClinic(id, city, clinicBranchId);
  }
}
