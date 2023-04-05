import { Patient } from './models/patient.entity';

export const patientProviders = [
  {
    provide: 'PATIENTS_REPOSITORY',
    useValue: Patient,
  },
];
