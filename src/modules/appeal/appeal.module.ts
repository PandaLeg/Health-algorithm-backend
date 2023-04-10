import { Module } from '@nestjs/common';
import { AppealController } from './controllers/appeal.controller';
import { AppealService } from './services/appeal.service';
import { appealProviders } from './appeal.providers';

@Module({
  controllers: [AppealController],
  providers: [AppealService, ...appealProviders],
})
export class AppealModule {}
