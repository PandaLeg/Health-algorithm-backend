import { ClinicSearch } from './clinic-search.interface';
import { ScheduleClinic } from './schedule-clinic.interface';

export interface ClinicFullInfo extends ClinicSearch {
  address: string;
  conveniences: { id: number; name: string }[];
  schedule: ScheduleClinic[];
}
