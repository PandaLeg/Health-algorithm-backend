import { Controller, Get, Param, Query, UseFilters } from '@nestjs/common';
import { ClinicService } from '../services/clinic.service';
import { HttpExceptionFilter } from '../../../exceptions/http-exception.filter';
import { ClinicInfo } from '../interfaces/clinic-info.interface';
import { QueryClinicDto } from '../dto/query-clinic.dto';
import { GeneralValidationPipe } from '../../../pipes/general-validation.pipe';
import { ClinicSearchPage } from '../interfaces/clinic-search-page.interface';
import { ClinicSearch } from '../interfaces/clinic-search.interface';
import { ClinicFullInfo } from '../interfaces/clinic-full-info.interface';
import { PageDto } from '../../../dto/PageDto';
import { CurrentClinicBranchDto } from '../dto/current-clinic-branch.dto';

@Controller('clinics')
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @UseFilters(new HttpExceptionFilter())
  @Get('/names')
  async getAllByCityAndName(
    @Query(new GeneralValidationPipe()) queryClinicDto: QueryClinicDto,
  ): Promise<ClinicInfo[]> {
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
  ): Promise<ClinicSearchPage> {
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
  ): Promise<ClinicSearch> {
    return this.clinicService.searchClinicByIdAndCity(id, city);
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
