import { forwardRef, Module } from '@nestjs/common';
import { appointmentProviders } from './appointment.providers';
import { AppointmentService } from './services/appointment.service';
import { AppointmentController } from './controllers/appointment.controller';
import { ClinicModule } from '../clinic/clinic.module';
import { DoctorModule } from '../doctor/doctor.module';
import { PatientModule } from '../patient/patient.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ClinicModule,
    forwardRef(() => DoctorModule),
    PatientModule,
    AuthModule,
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService, ...appointmentProviders],
  exports: [AppointmentService],
})
export class AppointmentModule {}
