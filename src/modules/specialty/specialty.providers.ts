import { Specialty } from './models/specialty.entity';

export const specialtyProviders = [
  {
    provide: 'SPECIALTY_REPOSITORY',
    useValue: Specialty,
  },
];
