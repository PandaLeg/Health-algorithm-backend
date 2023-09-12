import { Patient } from './models/patient.entity';
import { PatientRepository } from './repos/patient.repository';

export const patientProviders = [
  {
    provide: 'PATIENTS_REPOSITORY',
    useValue: Patient,
  },
  {
    provide: 'IPatientRepository',
    useClass: PatientRepository,
  },
];
