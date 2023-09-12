import { WeekDay } from './models/week-day.entity';
import { WeekDayRepository } from './repos/week-day.repository';

export const weekDayProviders = [
  {
    provide: 'WEEK_DAY_REPOSITORY',
    useValue: WeekDay,
  },
  {
    provide: 'IWeekDayRepository',
    useClass: WeekDayRepository,
  },
];
