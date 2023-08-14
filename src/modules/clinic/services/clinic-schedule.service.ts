import { Inject, Injectable } from '@nestjs/common';
import { ClinicSchedule } from '../models/clinic-schedule.entity';
import { ClinicScheduleDto } from '../dto/clinic-schedule.dto';
import { WeekDay } from '../../week-day/models/week-day.entity';

@Injectable()
export class ClinicScheduleService {
  constructor(
    @Inject('CLINIC_SCHEDULE_REPOSITORY')
    private clinicScheduleRepo: typeof ClinicSchedule,
  ) {}

  async createSchedule(
    clinicBranchId: string,
    scheduleClinic: ClinicScheduleDto,
    weekDayId: number,
  ) {
    await this.clinicScheduleRepo.create({
      clinicBranchId,
      dayType: scheduleClinic.dayType,
      weekDayId,
      from: scheduleClinic.from,
      to: scheduleClinic.to,
    });
  }

  async getByAddressAndTime(
    clinicBranchId: string,
    from: string,
    to: string,
  ): Promise<ClinicSchedule[]> {
    const schedules: ClinicSchedule[] = await this.clinicScheduleRepo.findAll({
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

    return schedules;
  }
}
