import { Module } from '@nestjs/common';
import { ClinicController } from './controllers/clinic.controller';
import { ClinicService } from './services/clinic.service';
import { clinicProviders } from './clinic.providers';
import { DatabaseModule } from '../../db-init/database.module';
import { ClinicLocationService } from './services/clinic-location.service';
import { LocationAddressService } from './services/location-address.service';
import { ClinicScheduleService } from './services/clinic-schedule.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ClinicController],
  providers: [
    ClinicService,
    ClinicLocationService,
    LocationAddressService,
    ClinicScheduleService,
    ...clinicProviders,
  ],
  exports: [ClinicService],
})
export class ClinicModule {}
