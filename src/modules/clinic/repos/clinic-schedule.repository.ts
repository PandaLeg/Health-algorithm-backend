import { BaseRepository } from '../../../base/repos/base.repository';
import { ClinicSchedule } from '../models/clinic-schedule.entity';
import { IClinicScheduleRepository } from './clinic-schedule.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { WeekDay } from '../../week-day/models/week-day.entity';

@Injectable()
export class ClinicScheduleRepository
  extends BaseRepository<ClinicSchedule>
  implements IClinicScheduleRepository
{
  constructor(
    @Inject('CLINIC_SCHEDULE_REPOSITORY')
    private clinicScheduleRepo: typeof ClinicSchedule,
  ) {
    super(clinicScheduleRepo);
  }

  findByClinicBranchAndTime(
    clinicBranchId: string,
    from: string,
    to: string,
  ): Promise<ClinicSchedule[]> {
    return this.clinicScheduleRepo.findAll({
      where: {
        clinicBranchId,
        from,
        to,
      },
      attributes: ['dayType', 'from', 'to', 'weekDayId'],
      include: [
        {
          model: WeekDay,
          attributes: ['id', 'name'],
        },
      ],
    });
  }
}
