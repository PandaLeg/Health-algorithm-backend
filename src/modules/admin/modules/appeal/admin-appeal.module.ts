import { Module } from '@nestjs/common';
import { AdminAppealController } from './controllers/admin-appeal.controller';
import { AdminAppealService } from './services/admin-appeal.service';
import { AppealModule } from '../../../appeal/appeal.module';

@Module({
  imports: [AppealModule],
  controllers: [AdminAppealController],
  providers: [AdminAppealService],
})
export class AdminAppealModule {}
