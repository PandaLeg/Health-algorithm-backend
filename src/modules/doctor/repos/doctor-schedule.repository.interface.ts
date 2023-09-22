import { IBaseRepository } from '../../../db/repos/base.repository.interface';
import { DoctorSchedule } from '../models/doctor-schedule.entity';
import { IClinicDoctorSchedule } from '../interfaces/clinic-doctor.interface';

export interface IDoctorScheduleRepository
  extends IBaseRepository<DoctorSchedule> {
  findAllByDoctorAndBranch(
    doctorId: string,
    clinicBranchId: string,
  ): Promise<DoctorSchedule[]>;

  findAllByDoctorAndCity(
    doctorId: string,
    city: string,
  ): Promise<IClinicDoctorSchedule[]>;
}
