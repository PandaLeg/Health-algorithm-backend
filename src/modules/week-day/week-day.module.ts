import { Module } from '@nestjs/common';
import { weekDayProviders } from './week-day.providers';
import { WeekDayService } from './services/week-day.service';
import { WeekDayController } from './controllers/week-day.controller';

@Module({
  controllers: [WeekDayController],
  providers: [WeekDayService, ...weekDayProviders],
  exports: [WeekDayService],
})
export class WeekDayModule {}
