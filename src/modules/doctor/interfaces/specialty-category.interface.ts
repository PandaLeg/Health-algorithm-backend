import { Specialty } from '../../specialty/models/specialty.entity';

export interface SpecialtyCategory {
  specialties: Specialty[];
  categoryId: number;
}
