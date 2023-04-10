import { Module } from '@nestjs/common';
import { ClinicController } from './controllers/clinic.controller';
import { ClinicService } from './services/clinic.service';
import { clinicProviders } from './clinic.providers';

@Module({
  imports: [],
  controllers: [ClinicController],
  providers: [ClinicService, ...clinicProviders],
  exports: [ClinicService],
})
export class ClinicModule {}
