import { IBaseRepository } from '../../../db/repos/base.repository.interface';
import { Specialty } from '../models/specialty.entity';

export interface ISpecialtyRepository extends IBaseRepository<Specialty> {
  findAllByIds(specialties: { id: number }[]): Promise<Specialty[]>;

  findAllWithAttributes(): Promise<Specialty[]>;

  findAllByDoctorId(doctorId: string): Promise<Specialty[]>;
}
