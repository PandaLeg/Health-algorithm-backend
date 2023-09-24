import { BaseRepository } from '../../../db/repos/base.repository';
import { WeekDay } from '../models/week-day.entity';
import { IWeekDayRepository } from './week-day.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class WeekDayRepository
  extends BaseRepository<WeekDay>
  implements IWeekDayRepository
{
  constructor(
    @Inject('WEEK_DAY_REPOSITORY') private weekDayRepo: typeof WeekDay,
  ) {
    super(weekDayRepo);
  }
}
