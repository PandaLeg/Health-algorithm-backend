import { Module } from '@nestjs/common';
import { AdminAppealModule } from './modules/appeal/admin-appeal.module';

@Module({
  imports: [AdminAppealModule],
  controllers: [],
  providers: [],
})
export class AdminModule {}
