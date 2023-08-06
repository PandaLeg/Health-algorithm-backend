import { ClinicCardInfo } from './clinic-card-info.interface';
import { ScheduleClinic } from './schedule-clinic.interface';

export interface ClinicFullInfo extends ClinicCardInfo {
  address: string;
  schedule: ScheduleClinic[];
}
