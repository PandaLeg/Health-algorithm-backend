import { Module } from '@nestjs/common';
import { DoctorController } from './controllers/doctor.controller';
import { DoctorService } from './services/doctor.service';
import { doctorProviders } from './doctor.providers';
import { CategoryDoctorService } from './services/category-doctor.service';
import { SpecialtyService } from './services/specialty.service';
import { DescriptionDoctorService } from './services/description-doctor.service';
import { SpecialtyController } from './controllers/specialty.controller';
import { DoctorLocationService } from './services/doctor-location.service';
import { DatabaseModule } from '../../db-init/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DoctorController, SpecialtyController],
  providers: [
    DoctorService,
    DescriptionDoctorService,
    CategoryDoctorService,
    SpecialtyService,
    DoctorLocationService,
    ...doctorProviders,
  ],
  exports: [DoctorService],
})
export class DoctorModule {}
