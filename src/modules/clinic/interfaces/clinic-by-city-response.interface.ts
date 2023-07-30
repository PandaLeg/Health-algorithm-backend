import { ClinicByCity } from './clinic-by-city.interface';

export interface ClinicByCityResponse {
  clinics: ClinicByCity[];
  totalPages: number;
}
