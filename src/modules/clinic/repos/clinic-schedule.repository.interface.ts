import { IBaseRepository } from '../../../db/repos/base.repository.interface';
import { ClinicSchedule } from '../models/clinic-schedule.entity';

export interface IClinicScheduleRepository
  extends IBaseRepository<ClinicSchedule> {
  findByClinicBranchAndTime(
    clinicBranchId: string,
    from: string,
    to: string,
  ): Promise<ClinicSchedule[]>;
}
