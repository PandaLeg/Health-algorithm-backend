import { Appointment } from './models/appointment.entity';

export const appointmentProviders = [
  {
    provide: 'APPOINTMENT_REPOSITORY',
    useValue: Appointment,
  },
];
