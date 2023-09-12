import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DoctorSchedule } from '../models/doctor-schedule.entity';
import { DoctorScheduleDto } from '../dto/doctor-schedule.dto';
import { IDoctorScheduleRepository } from '../repos/doctor-schedule.repository.interface';

@Injectable()
export class DoctorScheduleService {
  constructor(
    @Inject('IDoctorScheduleRepository')
    private doctorScheduleRepo: IDoctorScheduleRepository,
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

  async getAllByDoctorAndBranch(
    doctorId: string,
    clinicBranchId: string,
  ): Promise<DoctorSchedule[]> {
    const schedule: DoctorSchedule[] =
      await this.doctorScheduleRepo.findAllByDoctorAndBranch(
        doctorId,
        clinicBranchId,
      );

    if (!schedule) {
      throw new InternalServerErrorException();
    }

    return schedule;
  }
}
