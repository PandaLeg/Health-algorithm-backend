import { Module } from '@nestjs/common';
import { ClinicController } from './controllers/clinic.controller';
import { ClinicService } from './services/clinic.service';
import { clinicProviders } from './clinic.providers';
import { DatabaseModule } from '../../db-init/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ClinicController],
  providers: [ClinicService, ...clinicProviders],
  exports: [ClinicService],
})
export class ClinicModule {}
