import { DoctorSpecialty } from './models/doctor-specialty.entity';

export const doctorSpecialtyProviders = [
  {
    provide: 'DOCTOR_SPECIALTY_REPOSITORY',
    useValue: DoctorSpecialty,
  },
];
