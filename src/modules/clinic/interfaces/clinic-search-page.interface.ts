import { ClinicSearch } from './clinic-search.interface';

export interface ClinicSearchPage {
  clinics: ClinicSearch[];
  totalPages: number;
}
