import { Inject, Injectable } from '@nestjs/common';
import { ClinicSchedule } from '../models/clinic-schedule.entity';
import { ClinicScheduleDto } from '../dto/clinic-schedule.dto';

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
}
