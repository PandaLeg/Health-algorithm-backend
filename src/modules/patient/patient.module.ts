import { Module } from '@nestjs/common';
import { patientProviders } from './patient.providers';
import { PatientService } from './services/patient.service';

@Module({
  imports: [],
  controllers: [],
  providers: [...patientProviders, PatientService],
})
export class PatientModule {}
