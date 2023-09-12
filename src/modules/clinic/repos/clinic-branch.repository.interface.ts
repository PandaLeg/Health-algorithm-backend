import { IBaseRepository } from '../../../base/repos/base.repository.interface';
import { ClinicBranch } from '../models/clinic-branch.entity';
import { PageDto } from '../../../dto/PageDto';
import { IEntityPagination } from '../../../base/interfaces/entity-pagination.interface';

export interface IClinicBranchRepository extends IBaseRepository<ClinicBranch> {
  findAllByLocation(locationId: string): Promise<ClinicBranch[]>;

  findFirstByLocation(locationId: string): Promise<ClinicBranch>;

  findByIdWithClinic(id: string): Promise<ClinicBranch>;

  findByIdWithSchedule(id: string): Promise<ClinicBranch>;

  findAndCountAllByLocationWithoutCurrent(
    locationId: string,
    clinicBranchId: string,
    pageDto: PageDto,
  ): Promise<IEntityPagination<ClinicBranch>>;

  findByIdWithDoctor(id: string): Promise<ClinicBranch>;

  findByIdWithAttributes(id: string): Promise<ClinicBranch>;
}
