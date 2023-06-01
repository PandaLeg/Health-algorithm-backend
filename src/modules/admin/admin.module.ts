import { Module } from '@nestjs/common';
import { ClinicAppealModule } from './modules/clinic-appeal/clinic-appeal.module';
import { AdminAppealModule } from './modules/appeal/admin-appeal.module';

@Module({
  imports: [ClinicAppealModule, AdminAppealModule],
  controllers: [],
  providers: [],
})
export class AdminModule {}
