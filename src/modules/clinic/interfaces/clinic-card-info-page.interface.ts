import { ClinicCardInfo } from './clinic-card-info.interface';

export interface ClinicCardInfoPage {
  clinics: ClinicCardInfo[];
  totalPages: number;
}
