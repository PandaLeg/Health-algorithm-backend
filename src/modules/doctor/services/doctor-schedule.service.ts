import { Inject, Injectable } from '@nestjs/common';
import { DoctorSchedule } from '../models/doctor-schedule.entity';
import { DoctorScheduleDto } from '../dto/doctor-schedule.dto';

@Injectable()
export class DoctorScheduleService {
  constructor(
    @Inject('DOCTOR_SCHEDULE_REPOSITORY')
    private doctorScheduleRepo: typeof DoctorSchedule,
  ) {}

  async create(
    clinicBranchId: string,
    doctorId: string,
    schedule: DoctorScheduleDto,
  ) {
    await this.doctorScheduleRepo.create({
      from: schedule.from,
      to: schedule.to,
      duration: schedule.duration,
      weekDayId: schedule.weekDayId,
      clinicBranchId,
      doctorId,
    });
  }
}
