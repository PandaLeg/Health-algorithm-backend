import { Doctor } from './models/doctor.entity';

export const doctorProviders = [
  {
    provide: 'DOCTORS_REPOSITORY',
    useValue: Doctor,
  },
];
