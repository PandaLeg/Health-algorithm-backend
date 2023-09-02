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
import { HttpExceptionFilter } from '../../../exceptions/http-exception.filter';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { GeneralValidationPipe } from '../../../pipes/general-validation.pipe';
import { AuthAccessGuard } from '../../auth/guards/auth-access.guard';

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
  @Get('/times')
  async getTimeByDate(
    @Query('date') date: string,
    @Query('doctorId') doctorId: string,
  ): Promise<string[]> {
    return this.appointmentService.getTimeByDate(date, doctorId);
  }
}
