import { Inject, Injectable } from '@nestjs/common';
import { WeekDay } from '../models/week-day.entity';

@Injectable()
export class WeekDayService {
  constructor(
    @Inject('WEEK_DAY_REPOSITORY') private weekDayRepo: typeof WeekDay,
  ) {}

  async getAll() {
    const weekDays: WeekDay[] = await this.weekDayRepo.findAll();

    return weekDays;
  }
}
