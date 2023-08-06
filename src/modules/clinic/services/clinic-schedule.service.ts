import { Inject, Injectable } from '@nestjs/common';
import { ClinicSchedule } from '../models/clinic-schedule.entity';
import { ClinicScheduleDto } from '../dto/clinic-schedule.dto';
import { WeekDay } from '../../week-day/models/week-day.entity';

@Injectable()
export class ClinicScheduleService {
  constructor(
    @Inject('CLINIC_SCHEDULE_REPOSITORY')
    private clinicSchedule: typeof ClinicSchedule,
  ) {}

  async createSchedule(
    clinicId: string,
    addressId: string,
    scheduleClinic: ClinicScheduleDto,
    weekDayId: number,
  ) {
    await this.clinicSchedule.create({
      clinicId,
      addressId,
      dayType: scheduleClinic.dayType,
      weekDayId,
      from: scheduleClinic.from,
      to: scheduleClinic.to,
    });
  }

  async getByAddressAndTime(addressId: string, from: string, to: string) {
    const schedules: ClinicSchedule[] = await this.clinicSchedule.findAll({
      where: {
        addressId,
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
