import { Body, Controller, Get, Post, Query, UseFilters } from '@nestjs/common';
import { AppointmentService } from '../services/appointment.service';
import { HttpExceptionFilter } from '../../../base/exceptions/http-exception.filter';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { GeneralValidationPipe } from '../../../base/pipes/general-validation.pipe';
import { IAppointmentPage } from '../interfaces/appointment-page.interface';
import { PageDto } from '../../../base/dto/PageDto';
import { Auth } from '../../auth/guards/roles.auth.decorator';
import { RoleType } from '../../user/enums/role-type.enum';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @UseFilters(new HttpExceptionFilter())
  @Auth(RoleType.PATIENT_ROLE)
  @Post()
  async createAppointment(
    @Body(new GeneralValidationPipe())
    appointment: CreateAppointmentDto,
  ): Promise<{ message: string }> {
    return this.appointmentService.create(appointment);
  }

  @UseFilters(new HttpExceptionFilter())
  @Auth(RoleType.PATIENT_ROLE, RoleType.CLINIC_ROLE)
  @Get()
  async getAll(
    @Query('id') id: string,
    @Query(new GeneralValidationPipe()) pageDto: PageDto,
    @Body('authPayload') authPayload: any,
  ): Promise<IAppointmentPage> {
    const roles = authPayload.roles;
    return this.appointmentService.getAll(id, roles, pageDto);
  }

  @UseFilters(new HttpExceptionFilter())
  @Auth(RoleType.PATIENT_ROLE)
  @Get('/times')
  async getTimeByDate(
    @Query('date') date: string,
    @Query('doctorId') doctorId: string,
  ): Promise<string[]> {
    return this.appointmentService.getTimeByDate(doctorId, date);
  }
}
