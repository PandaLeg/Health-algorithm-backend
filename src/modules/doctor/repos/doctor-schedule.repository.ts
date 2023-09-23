import { BaseRepository } from '../../../db/repos/base.repository';
import { DoctorSchedule } from '../models/doctor-schedule.entity';
import { IDoctorScheduleRepository } from './doctor-schedule.repository.interface';
import { Inject } from '@nestjs/common';
import { WeekDay } from '../../week-day/models/week-day.entity';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { IClinicDoctorSchedule } from '../interfaces/clinic-doctor.interface';

export class DoctorScheduleRepository
  extends BaseRepository<DoctorSchedule>
  implements IDoctorScheduleRepository
{
  constructor(
    @Inject('DOCTOR_SCHEDULE_REPOSITORY')
    private doctorScheduleRepo: typeof DoctorSchedule,
    @Inject('SEQUELIZE') private sequelize: Sequelize,
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

  findAllByDoctorAndCity(
    doctorId: string,
    city: string,
  ): Promise<IClinicDoctorSchedule[]> {
    const query = `
    SELECT ds.from, ds.to, ds.duration, ds."doctorId", ds."clinicBranchId", wd.id as "weekDayId", wd.name as "weekDayName" 
    FROM doctor_schedule as ds
    INNER JOIN week_days as wd ON ds."weekDayId" = wd.id
    INNER JOIN clinic_branches as cb ON cb.id = ds."clinicBranchId"
    INNER JOIN clinic_locations as cl ON cl.id = cb."locationId" 
    WHERE ds."doctorId" = '${doctorId}' AND lower(cl.city) = '${city.toLowerCase()}'
    GROUP BY wd.id, ds.id
    ORDER BY wd.id < (SELECT EXTRACT(isodow from date (current_date)))
    `;

    return this.sequelize.query<IClinicDoctorSchedule>(query, {
      type: QueryTypes.SELECT,
    });
  }
}
