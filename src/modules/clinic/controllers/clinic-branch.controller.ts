import {
  Controller,
  Get,
  Param,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ClinicBranchService } from '../services/clinic-branch.service';
import { HttpExceptionFilter } from '../../../exceptions/http-exception.filter';
import { GeneralValidationPipe } from '../../../pipes/general-validation.pipe';
import { QueryLocationDto } from '../dto/query-location.dto';
import { ClinicAddressInfo } from '../interfaces/clinic-address-info.interface';
import { AppointmentScheduleFromClinic } from '../../doctor/interfaces/appointment-schedule.interface';
import { AuthAccessGuard } from '../../auth/guards/auth-access.guard';
import { ClinicDoctors } from '../interfaces/clinic-doctors.interface';
import { PageDto } from '../../../dto/PageDto';

@Controller('clinic-branches')
export class ClinicBranchController {
  constructor(private readonly clinicBranchService: ClinicBranchService) {}

  @UseFilters(new HttpExceptionFilter())
  @Get('/addresses')
  async getClinicAddresses(
    @Query(new GeneralValidationPipe()) queryLocationDto: QueryLocationDto,
  ): Promise<ClinicAddressInfo[]> {
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
  ): Promise<AppointmentScheduleFromClinic[]> {
    return this.clinicBranchService.getClinicDoctorSchedule(id);
  }

  @UseFilters(new HttpExceptionFilter())
  @Get('/:id/doctors')
  async getClinicDoctors(
    @Param('id') id: string,
    @Query(new GeneralValidationPipe()) pageDto: PageDto,
  ): Promise<ClinicDoctors> {
    return this.clinicBranchService.getClinicDoctors(id, pageDto);
  }
}
