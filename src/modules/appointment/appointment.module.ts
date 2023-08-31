import { Module } from '@nestjs/common';
import { appointmentProviders } from './appointment.providers';
import { AppointmentService } from './services/appointment.service';
import { AppointmentController } from './controllers/appointment.controller';
import { ClinicModule } from '../clinic/clinic.module';
import { DoctorModule } from '../doctor/doctor.module';
import { PatientModule } from '../patient/patient.module';

@Module({
  imports: [ClinicModule, DoctorModule, PatientModule],
  controllers: [AppointmentController],
  providers: [AppointmentService, ...appointmentProviders],
})
export class AppointmentModule {}
