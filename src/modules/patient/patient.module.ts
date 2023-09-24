import { Module } from '@nestjs/common';
import { patientProviders } from './patient.providers';
import { PatientService } from './services/patient.service';

@Module({
  controllers: [],
  providers: [...patientProviders, PatientService],
  exports: [PatientService],
})
export class PatientModule {}
