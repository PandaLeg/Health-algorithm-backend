import { Module } from '@nestjs/common';
import { categoryDoctorProviders } from './category-doctor.providers';
import { CategoryDoctorService } from './services/category-doctor.service';

@Module({
  imports: [],
  providers: [CategoryDoctorService, ...categoryDoctorProviders],
  exports: [CategoryDoctorService],
})
export class CategoryDoctorModule {}
