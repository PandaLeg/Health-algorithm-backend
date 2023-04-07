import { CategoryDoctor } from './models/category-doctor.entity';

export const categoryDoctorProviders = [
  {
    provide: 'CATEGORY_DOCTOR_REPOSITORY',
    useValue: CategoryDoctor,
  },
];
