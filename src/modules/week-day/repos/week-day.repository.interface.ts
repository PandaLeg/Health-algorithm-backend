import { IBaseRepository } from '../../../db/repos/base.repository.interface';
import { WeekDay } from '../models/week-day.entity';

export interface IWeekDayRepository extends IBaseRepository<WeekDay> {}
