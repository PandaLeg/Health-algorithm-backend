import {
  Controller,
  Get,
  Param,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { DoctorService } from '../services/doctor.service';
import { HttpExceptionFilter } from '../../../base/exceptions/http-exception.filter';
import { IDoctorResponse } from '../interfaces/doctor-response.interface';
import { LastNameDto } from '../dto/last-name.dto';
import { GeneralValidationPipe } from '../../../base/pipes/general-validation.pipe';
import { PageDto } from '../../../base/dto/PageDto';
import { DoctorSearchDto } from '../dto/doctor-search.dto';
import { IDoctorName } from '../interfaces/doctor-name.interface';
import { IDoctorClinic } from '../interfaces/doctor-clinic.interface';
import { ParseJsonBranchesPipe } from '../pipes/parse-json-branches.pipe';
import { IAppointmentScheduleFromDoctor } from '../interfaces/appointment-schedule.interface';
import { AuthAccessGuard } from '../../auth/guards/auth-access.guard';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @UseFilters(new HttpExceptionFilter())
  @Get()
  async getAllDoctors(
    @Query(new GeneralValidationPipe()) pageDto: PageDto,
  ): Promise<IDoctorResponse> {
    return this.doctorService.getAllDoctors(pageDto);
  }

  @UseFilters(new HttpExceptionFilter())
  @Get('/categories-specialties')
  async getCategoriesSpecialties() {
    return this.doctorService.findCategoriesSpecialties();
  }

  @UseFilters(new HttpExceptionFilter())
  @Get('/names')
  async getNames(
    @Query(new GeneralValidationPipe()) lastNameDto: LastNameDto,
  ): Promise<IDoctorName[]> {
    return this.doctorService.getNames(lastNameDto);
  }

  @UseFilters(new HttpExceptionFilter())
  @Get('/search')
  async searchDoctors(
    @Query(new GeneralValidationPipe())
    searchDto: DoctorSearchDto,
  ): Promise<IDoctorResponse> {
    return this.doctorService.searchDoctors(searchDto);
  }

  @UseFilters(new HttpExceptionFilter())
  @Get('/:id/clinics')
  async getDoctorWithClinics(
    @Param('id') doctorId: string,
  ): Promise<IDoctorClinic> {
    return this.doctorService.getDoctorWithClinics(doctorId);
  }

  @UseGuards(AuthAccessGuard)
  @UseFilters(new HttpExceptionFilter())
  @Get('/:id/schedule')
  async getAppointmentSchedule(
    @Param('id') doctorId: string,
    @Query('clinicBranches', new ParseJsonBranchesPipe())
    clinicBranches: string[],
  ): Promise<IAppointmentScheduleFromDoctor[]> {
    return this.doctorService.getAppointmentSchedule(doctorId, clinicBranches);
  }
}
