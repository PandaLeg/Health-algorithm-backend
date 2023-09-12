import {
  Controller,
  Get,
  Param,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ClinicBranchService } from '../services/clinic-branch.service';
import { HttpExceptionFilter } from '../../../base/exceptions/http-exception.filter';
import { GeneralValidationPipe } from '../../../base/pipes/general-validation.pipe';
import { QueryLocationDto } from '../dto/query-location.dto';
import { IClinicAddressInfo } from '../interfaces/clinic-address-info.interface';
import { IAppointmentScheduleFromClinic } from '../../doctor/interfaces/appointment-schedule.interface';
import { AuthAccessGuard } from '../../auth/guards/auth-access.guard';
import { IClinicDoctors } from '../interfaces/clinic-doctors.interface';
import { PageDto } from '../../../base/dto/PageDto';

@Controller('clinic-branches')
export class ClinicBranchController {
  constructor(private readonly clinicBranchService: ClinicBranchService) {}

  @UseFilters(new HttpExceptionFilter())
  @Get('/addresses')
  async getClinicAddresses(
    @Query(new GeneralValidationPipe()) queryLocationDto: QueryLocationDto,
  ): Promise<IClinicAddressInfo[]> {
    return this.clinicBranchService.getClinicAddresses(
      queryLocationDto.clinicId,
      queryLocationDto.city,
    );
  }

  @UseGuards(AuthAccessGuard)
  @UseFilters(new HttpExceptionFilter())
  @Get('/:id/doctors-schedule')
  async getClinicDoctorSchedule(
    @Param('id') id: string,
  ): Promise<IAppointmentScheduleFromClinic[]> {
    return this.clinicBranchService.getClinicDoctorSchedule(id);
  }

  @UseFilters(new HttpExceptionFilter())
  @Get('/:id/doctors')
  async getClinicDoctors(
    @Param('id') id: string,
    @Query(new GeneralValidationPipe()) pageDto: PageDto,
  ): Promise<IClinicDoctors> {
    return this.clinicBranchService.getClinicDoctors(id, pageDto);
  }
}
