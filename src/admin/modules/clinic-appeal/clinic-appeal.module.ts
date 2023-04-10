import { Module } from '@nestjs/common';
import { clinicAppealProviders } from './clinic-appeal.providers';

@Module({
  providers: [...clinicAppealProviders],
})
export class ClinicAppealModule {}
