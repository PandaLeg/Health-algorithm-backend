import { IBaseRepository } from '../../../base/repos/base.repository.interface';
import { DoctorSchedule } from '../models/doctor-schedule.entity';

export interface IDoctorScheduleRepository
  extends IBaseRepository<DoctorSchedule> {
  findAllByDoctorAndBranch(
    doctorId: string,
    clinicBranchId: string,
  ): Promise<DoctorSchedule[]>;
}
