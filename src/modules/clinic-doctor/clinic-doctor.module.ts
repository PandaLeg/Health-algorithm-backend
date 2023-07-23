import { Module } from '@nestjs/common';
import { clinicDoctorProviders } from './clinic-doctor.providers';
import { ClinicDoctorService } from './services/clinic-doctor.service';

@Module({
  providers: [ClinicDoctorService, ...clinicDoctorProviders],
  exports: [ClinicDoctorService],
})
export class ClinicDoctorModule {}
