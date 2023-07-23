import { Doctor } from './models/doctor.entity';
import { CategoryDoctor } from './models/category-doctor.entity';
import { Specialty } from './models/specialty.entity';
import { DoctorSpecialty } from './models/doctor-specialty.entity';

export const doctorProviders = [
  {
    provide: 'DOCTOR_REPOSITORY',
    useValue: Doctor,
  },
  {
    provide: 'CATEGORY_DOCTOR_REPOSITORY',
    useValue: CategoryDoctor,
  },
  {
    provide: 'SPECIALTY_REPOSITORY',
    useValue: Specialty,
  },
  {
    provide: 'DOCTOR_SPECIALTY_REPOSITORY',
    useValue: DoctorSpecialty,
  },
];
