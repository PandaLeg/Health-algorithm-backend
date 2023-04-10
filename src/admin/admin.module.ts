import { Module } from '@nestjs/common';
import { ClinicAppealModule } from './modules/clinic-appeal/clinic-appeal.module';

@Module({
  imports: [ClinicAppealModule],
  controllers: [],
  providers: [],
})
export class AdminModule {}
