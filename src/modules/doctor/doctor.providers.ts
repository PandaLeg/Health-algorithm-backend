import { Doctor } from './models/doctor.entity';
import { CategoryDoctor } from './models/category-doctor.entity';
import { Specialty } from './models/specialty.entity';
import { DoctorSpecialty } from './models/doctor-specialty.entity';
import { DescriptionDoctor } from './models/description-doctor.entity';
import { DoctorLocation } from './models/doctor-location.entity';
import { DoctorSchedule } from './models/doctor-schedule.entity';

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
  {
    provide: 'DESCRIPTION_DOCTOR_REPOSITORY',
    useValue: DescriptionDoctor,
  },
  {
    provide: 'DOCTOR_LOCATION_REPOSITORY',
    useValue: DoctorLocation,
  },
  {
    provide: 'DOCTOR_SCHEDULE_REPOSITORY',
    useValue: DoctorSchedule,
  },
];
