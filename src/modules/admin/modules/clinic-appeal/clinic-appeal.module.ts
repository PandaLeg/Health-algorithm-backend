import { Module } from '@nestjs/common';
import { clinicAppealProviders } from './clinic-appeal.providers';
import { ClinicAppealService } from './services/clinic-appeal.service';

@Module({
  providers: [ClinicAppealService, ...clinicAppealProviders],
  exports: [ClinicAppealService],
})
export class ClinicAppealModule {}
