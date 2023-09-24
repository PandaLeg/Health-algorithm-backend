import { IClinicSearch } from './clinic-search.interface';
import { IScheduleClinic } from './schedule-clinic.interface';

export interface IClinicFullInfo extends IClinicSearch {
  address: string;
  conveniences: { id: number; name: string }[];
  schedule: IScheduleClinic[];
}
