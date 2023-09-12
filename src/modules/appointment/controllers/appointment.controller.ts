import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AppointmentService } from '../services/appointment.service';
import { HttpExceptionFilter } from '../../../base/exceptions/http-exception.filter';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { GeneralValidationPipe } from '../../../base/pipes/general-validation.pipe';
import { AuthAccessGuard } from '../../auth/guards/auth-access.guard';
import { IAppointmentPage } from '../interfaces/appointment-page.interface';
import { PageDto } from '../../../base/dto/PageDto';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @UseFilters(new HttpExceptionFilter())
  @Post()
  async createAppointment(
    @Body(new GeneralValidationPipe())
    appointment: CreateAppointmentDto,
  ): Promise<{ message: string }> {
    return this.appointmentService.create(appointment);
  }

  @UseGuards(AuthAccessGuard)
  @UseFilters(new HttpExceptionFilter())
  @Get()
  async getAll(
    @Query('id') id: string,
    @Query(new GeneralValidationPipe()) pageDto: PageDto,
    @Body('authPayload') authPayload: any,
  ): Promise<IAppointmentPage> {
    const roles = authPayload.roles;
    return this.appointmentService.getAll(id, roles, pageDto);
  }

  @UseGuards(AuthAccessGuard)
  @UseFilters(new HttpExceptionFilter())
  @Get('/times')
  async getTimeByDate(
    @Query('date') date: string,
    @Query('doctorId') doctorId: string,
  ): Promise<string[]> {
    return this.appointmentService.getTimeByDate(doctorId, date);
  }
}
