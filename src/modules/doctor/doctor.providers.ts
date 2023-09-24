import { Doctor } from './models/doctor.entity';
import { CategoryDoctor } from './models/category-doctor.entity';
import { Specialty } from './models/specialty.entity';
import { DoctorSpecialty } from './models/doctor-specialty.entity';
import { DescriptionDoctor } from './models/description-doctor.entity';
import { DoctorLocation } from './models/doctor-location.entity';
import { DoctorSchedule } from './models/doctor-schedule.entity';
import { DoctorRepository } from './repos/doctor.repository';
import { CategoryDoctorRepository } from './repos/category-doctor.repository';
import { SpecialtyRepository } from './repos/specialty.repository';
import { DescriptionDoctorRepository } from './repos/description-doctor.repository';
import { DoctorLocationRepository } from './repos/doctor-location.repository';
import { DoctorScheduleRepository } from './repos/doctor-schedule.repository';

export const doctorProviders = [
  {
    provide: 'DOCTOR_REPOSITORY',
    useValue: Doctor,
  },
  {
    provide: 'IDoctorRepository',
    useClass: DoctorRepository,
  },
  {
    provide: 'CATEGORY_DOCTOR_REPOSITORY',
    useValue: CategoryDoctor,
  },
  {
    provide: 'ICategoryDoctorRepository',
    useClass: CategoryDoctorRepository,
  },
  {
    provide: 'SPECIALTY_REPOSITORY',
    useValue: Specialty,
  },
  {
    provide: 'ISpecialtyRepository',
    useClass: SpecialtyRepository,
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
    provide: 'IDescriptionDoctorRepository',
    useClass: DescriptionDoctorRepository,
  },
  {
    provide: 'DOCTOR_LOCATION_REPOSITORY',
    useValue: DoctorLocation,
  },
  {
    provide: 'IDoctorLocationRepository',
    useClass: DoctorLocationRepository,
  },
  {
    provide: 'DOCTOR_SCHEDULE_REPOSITORY',
    useValue: DoctorSchedule,
  },
  {
    provide: 'IDoctorScheduleRepository',
    useClass: DoctorScheduleRepository,
  },
];
