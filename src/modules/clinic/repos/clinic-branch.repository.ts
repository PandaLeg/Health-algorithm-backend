import { BaseRepository } from '../../../db/repos/base.repository';
import { ClinicBranch } from '../models/clinic-branch.entity';
import { IClinicBranchRepository } from './clinic-branch.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ClinicSchedule } from '../models/clinic-schedule.entity';
import { WeekDay } from '../../week-day/models/week-day.entity';
import { Clinic } from '../models/clinic.entity';
import { Convenience } from '../models/convenience.entity';
import { PageDto } from '../../../base/dto/PageDto';
import { IEntityPagination } from '../../../base/interfaces/entity-pagination.interface';
import { Op } from 'sequelize';
import { Doctor } from '../../doctor/models/doctor.entity';
import { DoctorSchedule } from '../../doctor/models/doctor-schedule.entity';
import { ClinicLocation } from '../models/clinic-location.entity';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ClinicBranchRepository
  extends BaseRepository<ClinicBranch>
  implements IClinicBranchRepository
{
  constructor(
    @Inject('CLINIC_BRANCH_REPOSITORY')
    private clinicBranchRepo: typeof ClinicBranch,
    @Inject('SEQUELIZE') private sequelize: Sequelize,
  ) {
    super(clinicBranchRepo);
  }

  findAllByLocation(locationId: string): Promise<ClinicBranch[]> {
    return this.clinicBranchRepo.findAll({
      where: {
        locationId,
      },
      include: [
        {
          model: ClinicSchedule,
          where: { dayType: 'Workday' },
          include: [{ model: WeekDay, attributes: ['id', 'name'] }],
        },
      ],
    });
  }

  findByIdWithClinic(id: string): Promise<ClinicBranch> {
    return this.clinicBranchRepo.findByPk(id, {
      include: [
        {
          model: Clinic,
          attributes: ['userId'],
        },
      ],
    });
  }

  findByIdWithSchedule(id: string): Promise<ClinicBranch> {
    return this.clinicBranchRepo.findByPk(id, {
      include: [
        {
          model: Convenience,
          attributes: ['id', 'name'],
        },
        {
          model: ClinicSchedule,
          attributes: ['dayType', 'from', 'to', 'weekDayId'],
        },
      ],
    });
  }

  findFirstByLocation(locationId: string): Promise<ClinicBranch> {
    return this.clinicBranchRepo.findOne({
      where: {
        locationId,
      },
    });
  }

  findAndCountAllByLocationWithoutCurrent(
    locationId: string,
    clinicBranchId: string,
    pageDto: PageDto,
  ): Promise<IEntityPagination<ClinicBranch>> {
    return this.clinicBranchRepo.findAndCountAll({
      limit: pageDto.perPage,
      offset: pageDto.page,
      distinct: true,
      order: [['id', 'DESC']],
      where: {
        [Op.and]: [
          { locationId },
          {
            [Op.not]: [{ id: clinicBranchId }],
          },
        ],
      },
      include: [
        {
          model: Convenience,
          attributes: ['id', 'name'],
        },
        {
          model: ClinicSchedule,
          attributes: ['dayType', 'from', 'to', 'weekDayId'],
        },
      ],
    });
  }

  findByIdWithDoctor(id: string): Promise<ClinicBranch> {
    return this.clinicBranchRepo.findByPk(id, {
      include: [
        {
          model: Doctor,
          attributes: ['userId', 'firstName', 'lastName'],
          include: [
            {
              model: DoctorSchedule,
              where: { clinicBranchId: id },
              attributes: ['from', 'to', 'duration'],
              include: [{ model: WeekDay, attributes: ['id', 'name'] }],
            },
          ],
        },
      ],
    });
  }

  findByIdWithAttributes(id: string): Promise<ClinicBranch> {
    return this.clinicBranchRepo.findByPk(id, {
      attributes: ['id'],
    });
  }

  countAllByCity(city: string): Promise<number> {
    return this.clinicBranchRepo.count({
      distinct: true,
      include: [
        {
          model: ClinicLocation,
          where: this.sequelize.where(
            this.sequelize.fn('lower', this.sequelize.col('city')),
            city,
          ),
        },
      ],
    });
  }
}
