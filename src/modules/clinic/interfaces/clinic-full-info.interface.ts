import { ClinicCardInfo } from './clinic-card-info.interface';
import { ScheduleClinic } from './schedule-clinic.interface';
import { Convenience } from '../models/convenience.entity';

export interface ClinicFullInfo extends ClinicCardInfo {
  address: string;
  conveniences: { id: number; name: string }[];
  schedule: ScheduleClinic[];
}
