import { Module } from '@nestjs/common';
import { categoryDoctorProviders } from './category-doctor.providers';

@Module({
  imports: [],
  providers: [...categoryDoctorProviders],
})
export class CategoryDoctorModule {}
