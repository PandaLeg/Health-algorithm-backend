import { Module } from '@nestjs/common';
import { DoctorController } from './controllers/doctor.controller';
import { DoctorService } from './services/doctor.service';
import { doctorProviders } from './doctor.providers';

@Module({
  imports: [],
  controllers: [DoctorController],
  providers: [DoctorService, ...doctorProviders],
  exports: [DoctorService],
})
export class DoctorModule {}
