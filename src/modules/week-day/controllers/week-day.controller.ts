import { Controller, Get, UseFilters } from '@nestjs/common';
import { WeekDayService } from '../services/week-day.service';
import { HttpExceptionFilter } from '../../../exceptions/http-exception.filter';
import { WeekDay } from '../models/week-day.entity';

@Controller('week-days')
export class WeekDayController {
  constructor(private readonly weekDayService: WeekDayService) {}

  @UseFilters(new HttpExceptionFilter())
  @Get()
  async getAll(): Promise<WeekDay[]> {
    return this.weekDayService.getAll();
  }
}
