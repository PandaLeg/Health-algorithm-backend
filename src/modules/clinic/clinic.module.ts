import { forwardRef, Module } from '@nestjs/common';
import { ClinicController } from './controllers/clinic.controller';
import { ClinicService } from './services/clinic.service';
import { clinicProviders } from './clinic.providers';
import { DatabaseModule } from '../../db/database.module';
import { ClinicLocationService } from './services/clinic-location.service';
import { ClinicBranchService } from './services/clinic-branch.service';
import { ClinicScheduleService } from './services/clinic-schedule.service';
import { ConvenienceController } from './controllers/convenience.controller';
import { ConvenienceService } from './services/convenience.service';
import { ClinicTypeController } from './controllers/clinic-type.controller';
import { ClinicTypeService } from './services/clinic-type.service';
import { ClinicConvenienceService } from './services/clinic-convenience.service';
import { ClinicBranchController } from './controllers/clinic-branch.controller';
import { AuthModule } from '../auth/auth.module';
import { DoctorModule } from '../doctor/doctor.module';

@Module({
  imports: [DatabaseModule, AuthModule, forwardRef(() => DoctorModule)],
  controllers: [
    ClinicController,
    ConvenienceController,
    ClinicTypeController,
    ClinicBranchController,
  ],
  providers: [
    ClinicService,
    ClinicLocationService,
    ClinicBranchService,
    ClinicScheduleService,
    ConvenienceService,
    ClinicConvenienceService,
    ClinicTypeService,
    ...clinicProviders,
  ],
  exports: [ClinicService, ClinicBranchService],
})
export class ClinicModule {}
