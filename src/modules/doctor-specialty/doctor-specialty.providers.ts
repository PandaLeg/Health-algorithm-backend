import { DoctorSpecialty } from '../doctor/models/doctor-specialty.entity';

export const doctorSpecialtyProviders = [
  {
    provide: 'DOCTOR_SPECIALTY_REPOSITORY',
    useValue: DoctorSpecialty,
  },
];
