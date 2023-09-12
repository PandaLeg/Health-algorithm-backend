import { Inject, Injectable } from '@nestjs/common';
import { IWeekDayRepository } from '../repos/week-day.repository.interface';

@Injectable()
export class WeekDayService {
  constructor(
    @Inject('IWeekDayRepository') private weekDayRepo: IWeekDayRepository,
  ) {}

  async getAll() {
    return await this.weekDayRepo.findAll();
  }
}
