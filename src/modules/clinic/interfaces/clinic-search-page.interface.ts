import { IClinicSearch } from './clinic-search.interface';

export interface IClinicSearchPage {
  clinics: IClinicSearch[];
  totalPages: number;
}
