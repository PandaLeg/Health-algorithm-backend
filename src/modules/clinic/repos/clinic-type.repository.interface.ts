import { IBaseRepository } from '../../../db/repos/base.repository.interface';
import { ClinicType } from '../models/clinic-type.entity';

export interface IClinicTypeRepository extends IBaseRepository<ClinicType> {
  findAllWithAttributes(): Promise<ClinicType[]>;

  findByIdWithAttributes(id: number): Promise<ClinicType>;
}
