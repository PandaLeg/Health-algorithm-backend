import { Clinic } from './models/clinic.entity';

export const clinicProviders = [
  {
    provide: 'CLINICS_REPOSITORY',
    useValue: Clinic,
  },
];
