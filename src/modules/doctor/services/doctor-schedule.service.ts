import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DoctorSchedule } from '../models/doctor-schedule.entity';
import { DoctorScheduleDto } from '../dto/doctor-schedule.dto';
import { WeekDay } from '../../week-day/models/week-day.entity';

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

  async getAllByDoctorAndBranch(
    doctorId: string,
    clinicBranchId: string,
  ): Promise<DoctorSchedule[]> {
    const schedule = await this.doctorScheduleRepo.findAll({
      where: {
        doctorId,
        clinicBranchId,
      },
      include: [{ model: WeekDay, attributes: ['id', 'name'] }],
    });

    if (!schedule) {
      throw new InternalServerErrorException();
    }

    return schedule;
  }
}
