import { Module } from '@nestjs/common';
import { DoctorController } from './controllers/doctor.controller';
import { DoctorService } from './services/doctor.service';
import { doctorProviders } from './doctor.providers';
import { CategoryDoctorModule } from '../category-doctor/category-doctor.module';
import { SpecialtyModule } from '../specialty/specialty.module';

@Module({
  imports: [CategoryDoctorModule, SpecialtyModule],
  controllers: [DoctorController],
  providers: [DoctorService, ...doctorProviders],
  exports: [DoctorService],
})
export class DoctorModule {}
