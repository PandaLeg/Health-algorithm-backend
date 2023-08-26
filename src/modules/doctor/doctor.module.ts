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
import { ClinicModule } from '../clinic/clinic.module';
import { DoctorScheduleService } from './services/doctor-schedule.service';

@Module({
  imports: [DatabaseModule, ClinicModule],
  controllers: [DoctorController, SpecialtyController],
  providers: [
    DoctorService,
    DescriptionDoctorService,
    CategoryDoctorService,
    SpecialtyService,
    DoctorLocationService,
    DoctorScheduleService,
    ...doctorProviders,
  ],
  exports: [DoctorService, DoctorScheduleService],
})
export class DoctorModule {}
