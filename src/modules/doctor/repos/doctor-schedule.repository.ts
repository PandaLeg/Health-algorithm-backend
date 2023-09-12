import { BaseRepository } from '../../../db/repos/base.repository';
import { DoctorSchedule } from '../models/doctor-schedule.entity';
import { IDoctorScheduleRepository } from './doctor-schedule.repository.interface';
import { Inject } from '@nestjs/common';
import { WeekDay } from '../../week-day/models/week-day.entity';

export class DoctorScheduleRepository
  extends BaseRepository<DoctorSchedule>
  implements IDoctorScheduleRepository
{
  constructor(
    @Inject('DOCTOR_SCHEDULE_REPOSITORY')
    private doctorScheduleRepo: typeof DoctorSchedule,
  ) {
    super(doctorScheduleRepo);
  }

  findAllByDoctorAndBranch(
    doctorId: string,
    clinicBranchId: string,
  ): Promise<DoctorSchedule[]> {
    return this.doctorScheduleRepo.findAll({
      where: {
        doctorId,
        clinicBranchId,
      },
      include: [{ model: WeekDay, attributes: ['id', 'name'] }],
    });
  }
}
