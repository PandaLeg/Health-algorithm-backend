import { Appointment } from './models/appointment.entity';
import { AppointmentRepository } from './repos/appointment.repository';

export const appointmentProviders = [
  {
    provide: 'APPOINTMENT_REPOSITORY',
    useValue: Appointment,
  },
  {
    provide: 'IAppointmentRepository',
    useClass: AppointmentRepository,
  },
];
