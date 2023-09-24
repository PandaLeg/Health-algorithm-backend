import { Inject, Injectable } from '@nestjs/common';
import { ClinicSchedule } from '../models/clinic-schedule.entity';
import { ClinicScheduleDto } from '../dto/clinic-schedule.dto';
import { IClinicScheduleRepository } from '../repos/clinic-schedule.repository.interface';

@Injectable()
export class ClinicScheduleService {
  constructor(
    @Inject('IClinicScheduleRepository')
    private clinicScheduleRepo: IClinicScheduleRepository,
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
    return await this.clinicScheduleRepo.findByClinicBranchAndTime(
      clinicBranchId,
      from,
      to,
    );
  }
}
