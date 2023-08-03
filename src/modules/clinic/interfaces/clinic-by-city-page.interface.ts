import { ClinicByCity } from './clinic-by-city.interface';

export interface ClinicByCityPage {
  clinics: ClinicByCity[];
  totalPages: number;
}
