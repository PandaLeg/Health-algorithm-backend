import { Module } from '@nestjs/common';
import { DoctorController } from './controllers/doctor.controller';
import { DoctorService } from './services/doctor.service';
import { doctorProviders } from './doctor.providers';
import { CategoryDoctorService } from './services/category-doctor.service';
import { SpecialtyService } from './services/specialty.service';

@Module({
  controllers: [DoctorController],
  providers: [
    DoctorService,
    CategoryDoctorService,
    SpecialtyService,
    ...doctorProviders,
  ],
  exports: [DoctorService],
})
export class DoctorModule {}
