import { ClinicInfoAppointment } from './clinic-info-appointment.interface';
import { DoctorInfoAppointment } from './doctor-info-appointment.interface';
import { PatientInfoAppointment } from './patient-info-appointment.interface';

export interface AppointmentFull {
  id: string;
  date: string;
  time: string;
  doctor: DoctorInfoAppointment;
  clinicBranch: ClinicInfoAppointment;
  patient: PatientInfoAppointment;
}
