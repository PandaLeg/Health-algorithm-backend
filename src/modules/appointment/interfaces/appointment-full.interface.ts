import { IClinicInfoAppointment } from './clinic-info-appointment.interface';
import { IDoctorInfoAppointment } from './doctor-info-appointment.interface';
import { IPatientInfoAppointment } from './patient-info-appointment.interface';

export interface IAppointmentFull {
  id: string;
  date: string;
  time: string;
  doctor: IDoctorInfoAppointment;
  clinicBranch: IClinicInfoAppointment;
  patient: IPatientInfoAppointment;
}
