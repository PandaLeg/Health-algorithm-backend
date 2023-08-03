import { Module } from '@nestjs/common';
import { ClinicController } from './controllers/clinic.controller';
import { ClinicService } from './services/clinic.service';
import { clinicProviders } from './clinic.providers';
import { DatabaseModule } from '../../db-init/database.module';
import { ClinicLocationService } from './services/clinic-location.service';
import { LocationAddressService } from './services/location-address.service';
import { ClinicScheduleService } from './services/clinic-schedule.service';
import { ConvenienceController } from './controllers/convenience.controller';
import { ConvenienceService } from './services/convenience.service';
import { ClinicTypeController } from './controllers/clinic-type.controller';
import { ClinicTypeService } from './services/clinic-type.service';
import { ClinicConvenienceService } from './services/clinic-convenience.service';
import { LocationAddressController } from './controllers/location-address.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    ClinicController,
    ConvenienceController,
    ClinicTypeController,
    LocationAddressController,
  ],
  providers: [
    ClinicService,
    ClinicLocationService,
    LocationAddressService,
    ClinicScheduleService,
    ConvenienceService,
    ClinicConvenienceService,
    ClinicTypeService,
    ...clinicProviders,
  ],
  exports: [ClinicService],
})
export class ClinicModule {}
