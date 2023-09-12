import { Controller, Get, Param, Query, UseFilters } from '@nestjs/common';
import { ClinicService } from '../services/clinic.service';
import { HttpExceptionFilter } from '../../../base/exceptions/http-exception.filter';
import { IClinicInfo } from '../interfaces/clinic-info.interface';
import { QueryClinicDto } from '../dto/query-clinic.dto';
import { GeneralValidationPipe } from '../../../base/pipes/general-validation.pipe';
import { IClinicSearchPage } from '../interfaces/clinic-search-page.interface';
import { IClinicSearch } from '../interfaces/clinic-search.interface';
import { IClinicFullInfo } from '../interfaces/clinic-full-info.interface';
import { PageDto } from '../../../base/dto/PageDto';
import { CurrentClinicBranchDto } from '../dto/current-clinic-branch.dto';

@Controller('clinics')
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @UseFilters(new HttpExceptionFilter())
  @Get('/names')
  async getAllByCityAndName(
    @Query(new GeneralValidationPipe()) queryClinicDto: QueryClinicDto,
  ): Promise<IClinicInfo[]> {
    return this.clinicService.getAllByCityAndName(
      queryClinicDto.city,
      queryClinicDto.name,
    );
  }

  @UseFilters(new HttpExceptionFilter())
  @Get('/search')
  async getAllByCity(
    @Query('city') city: string,
    @Query(new GeneralValidationPipe()) pageDto: PageDto,
  ): Promise<IClinicSearchPage> {
    return this.clinicService.searchClinicsByCity(city, pageDto);
  }

  @UseFilters(new HttpExceptionFilter())
  @Get('/without-current')
  async getFullInfoClinics(
    @Query(new GeneralValidationPipe())
    currentClinicDto: CurrentClinicBranchDto,
  ) {
    return this.clinicService.getFullInfoClinics(currentClinicDto);
  }

  @UseFilters(new HttpExceptionFilter())
  @Get('/:id/search')
  async getByCityAndName(
    @Param('id') id: string,
    @Query('city') city: string,
  ): Promise<IClinicSearch> {
    return this.clinicService.searchClinicByIdAndCity(id, city);
  }

  @UseFilters(new HttpExceptionFilter())
  @Get('/:id/full-info')
  async getFullInfoClinic(
    @Param('id') id: string,
    @Query('city') city: string,
    @Query('clinicBranch') clinicBranchId: string,
  ): Promise<IClinicFullInfo> {
    return this.clinicService.getFullInfoClinic(id, city, clinicBranchId);
  }
}
