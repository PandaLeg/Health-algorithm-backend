import { WeekDay } from './models/week-day.entity';

export const weekDayProviders = [
  {
    provide: 'WEEK_DAY_REPOSITORY',
    useValue: WeekDay,
  },
];
