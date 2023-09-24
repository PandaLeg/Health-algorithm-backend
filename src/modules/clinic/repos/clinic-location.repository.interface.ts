import { IBaseRepository } from '../../../db/repos/base.repository.interface';
import { ClinicLocation } from '../models/clinic-location.entity';

export interface IClinicLocationRepository
  extends IBaseRepository<ClinicLocation> {
  findByIdWithAttributes(id: string): Promise<ClinicLocation>;

  findOneByClinicAndCity(
    clinicId: string,
    city: string,
  ): Promise<ClinicLocation>;
}
