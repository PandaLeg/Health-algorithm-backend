import { Inject, Injectable } from '@nestjs/common';
import { Clinic } from '../models/clinic.entity';
import { CreateClinicDto } from '../dto/create-clinic.dto';
import { Sequelize } from 'sequelize-typescript';
import { ClinicInfo } from '../interfaces/clinic-info.interface';
import { QueryTypes } from 'sequelize';
import { ClinicLocationService } from './clinic-location.service';
import { ClinicLocation } from '../models/clinic-location.entity';
import { ClinicBranchService } from './clinic-branch.service';
import { ClinicBranch } from '../models/clinic-branch.entity';
import { ClinicScheduleService } from './clinic-schedule.service';
import { ClinicBranchDto } from '../dto/clinic-branch.dto';
import { ClinicConvenienceService } from './clinic-convenience.service';
import { ClinicCardInfo } from '../interfaces/clinic-card-info.interface';
import { User } from '../../user/models/user.entity';
import { ClinicType } from '../models/clinic-type.entity';
import { ClinicCardInfoPage } from '../interfaces/clinic-card-info-page.interface';
import { ClinicFullInfo } from '../interfaces/clinic-full-info.interface';
import { ClinicSchedule } from '../models/clinic-schedule.entity';
import { ScheduleClinic } from '../interfaces/schedule-clinic.interface';
import { NotFoundException } from '../../../exceptions/not-found.exception';
import { ErrorCodes } from '../../../exceptions/error-codes.enum';

@Injectable()
export class ClinicService {
  constructor(
    @Inject('CLINICS_REPOSITORY') private clinicRepo: typeof Clinic,
    @Inject('SEQUELIZE') private sequelize: Sequelize,
    private readonly clinicLocationService: ClinicLocationService,
    private readonly clinicBranchService: ClinicBranchService,
    private readonly clinicScheduleService: ClinicScheduleService,
    private readonly clinicConvenienceService: ClinicConvenienceService,
  ) {}

  async getByName(name: string): Promise<Clinic | null> {
    const clinic: Clinic | null = await this.clinicRepo.findOne({
      where: {
        name,
      },
    });

    return clinic;
  }

  async getAllByCity(
    page: number,
    perPage: number,
    city: string,
  ): Promise<ClinicCardInfoPage> {
    city = city.toLowerCase();

    const clinicsFromDb = await this.clinicRepo.findAndCountAll({
      limit: perPage,
      offset: page,
      distinct: true,
      order: [['userId', 'DESC']],
      include: [
        {
          model: ClinicLocation,
          where: this.sequelize.where(
            this.sequelize.fn('lower', this.sequelize.col('city')),
            city,
          ),
        },
        { model: User, attributes: ['avatar'] },
        { model: ClinicType, attributes: ['name'] },
      ],
    });

    const totalPages = Math.ceil(clinicsFromDb.count / perPage);
    const clinics: ClinicCardInfo[] = [];

    for (const el of clinicsFromDb.rows) {
      const locationId: string = el.locations[0].id;
      const clinicBranch: ClinicBranch =
        await this.clinicBranchService.getFirstByLocation(locationId);

      const clinic: ClinicCardInfo = {
        clinicId: el.userId,
        name: el.name,
        description: el.description,
        avatar: el.user.avatar,
        type: el.clinicType.name,
        city: city.toLowerCase(),
        clinicBranchId: clinicBranch.id,
      };

      clinics.push(clinic);
    }

    return {
      clinics,
      totalPages,
    };
  }

  async getByIdAndCity(id: string, city: string): Promise<ClinicCardInfo> {
    const clinicFromDb: Clinic = await this.clinicRepo.findOne({
      where: { userId: id },
      include: [
        { model: User, attributes: ['avatar'] },
        { model: ClinicType, attributes: ['name'] },
      ],
    });

    const location: ClinicLocation =
      await this.clinicLocationService.getByClinicIdAndCity(
        clinicFromDb.userId,
        city,
      );

    const clinicBranchId: string = location.clinicBranches[0].id;

    const clinic: ClinicCardInfo = {
      clinicId: clinicFromDb.userId,
      name: clinicFromDb.name,
      description: clinicFromDb.description,
      avatar: clinicFromDb.user.avatar,
      type: clinicFromDb.clinicType.name,
      city: location.city.toLowerCase(),
      clinicBranchId,
    };

    return clinic;
  }

  async createClinic(userId: string, dto: CreateClinicDto) {
    const clinic: Clinic = await this.clinicRepo.create({
      userId,
      name: dto.name,
      description: dto.description,
      clinicTypeId: dto.clinicType,
    });

    for (const location of dto.locations) {
      const clinicLocation: ClinicLocation =
        await this.clinicLocationService.createLocation(
          clinic.userId,
          location.city,
        );

      for (const clinicBranch of location.clinicBranches) {
        await this.createAddressAndSchedule(
          clinicLocation.id,
          clinic.userId,
          clinicBranch,
        );
      }
    }
  }

  async createAddressAndSchedule(
    clinicLocationId: string,
    clinicId: string,
    clinicBranch: ClinicBranchDto,
  ) {
    const newBranch: ClinicBranch = await this.clinicBranchService.create(
      clinicLocationId,
      clinicId,
      clinicBranch.address,
    );

    for (const convenienceId of clinicBranch.conveniences) {
      await this.clinicConvenienceService.create(convenienceId, newBranch.id);
    }

    for (const scheduleClinic of clinicBranch.scheduleClinic) {
      const weekDays: number[] = scheduleClinic.weekDays;

      for (const weekDayId of weekDays) {
        await this.clinicScheduleService.createSchedule(
          newBranch.id,
          scheduleClinic,
          weekDayId,
        );
      }
    }
  }

  async getAllByCityAndName(name: string, city: string) {
    const query = `
    SELECT c."userId" as "clinicId", c.name
    FROM clinics as c 
    INNER JOIN users as u on c."userId" = u.id 
    INNER JOIN clinic_locations as cl on c."userId" = cl."clinicId"
    where cl.city = '${city}' and LOWER(c.name) like LOWER('${name}%')
    `;

    const clinics: ClinicInfo[] = await this.sequelize.query<ClinicInfo>(
      query,
      { type: QueryTypes.SELECT },
    );

    return clinics;
  }

  async getFullInfoClinic(
    id: string,
    city: string,
    clinicBranchId: string,
  ): Promise<ClinicFullInfo> {
    const clinicFromDb: Clinic = await this.clinicRepo.findOne({
      where: { userId: id },
      include: [
        { model: User, attributes: ['avatar'] },
        { model: ClinicType, attributes: ['name'] },
      ],
    });

    if (!clinicFromDb) {
      throw new NotFoundException('Not found', ErrorCodes.NOT_FOUND);
    }

    const location: ClinicLocation =
      await this.clinicLocationService.getByClinicIdAndCity(
        clinicFromDb.userId,
        city,
      );

    const clinicBranch: ClinicBranch =
      await this.clinicBranchService.getByIdWithSchedule(clinicBranchId);

    const newSchedules: ScheduleClinic[] = await this.formScheduleForClinic(
      clinicBranch.schedules,
      clinicBranchId,
    );

    const clinic: ClinicFullInfo = {
      clinicId: clinicFromDb.userId,
      name: clinicFromDb.name,
      description: clinicFromDb.description,
      avatar: clinicFromDb.user.avatar,
      type: clinicFromDb.clinicType.name,
      city: location.city,
      clinicBranchId: clinicBranch.id,
      address: clinicBranch.address,
      conveniences: clinicBranch.conveniences.map((el) => ({
        id: el.id,
        name: el.name,
      })),
      schedule: newSchedules,
    };

    return clinic;
  }

  async getFullInfoClinics(
    id: string,
    city: string,
    clinicBranchId: string,
    page: number,
    perPage: number,
  ) {
    const clinicFromDb: Clinic = await this.clinicRepo.findByPk(id);

    if (!clinicFromDb) {
      throw new NotFoundException('Not found', ErrorCodes.NOT_FOUND);
    }

    const location: ClinicLocation =
      await this.clinicLocationService.getByClinicIdAndCity(
        clinicFromDb.userId,
        city,
      );

    const clinicBranches =
      await this.clinicBranchService.getAllByLocationWithSchedule(
        location.id,
        clinicBranchId,
        page,
        perPage,
      );

    const clinics = [];

    const totalPages = Math.ceil(clinicBranches.count / perPage);

    for (const clinicBranch of clinicBranches.rows) {
      const schedule: ScheduleClinic[] = await this.formScheduleForClinic(
        clinicBranch.schedules,
        clinicBranch.id,
      );

      const clinicInfo = {
        clinicBranchId: clinicBranch.id,
        address: clinicBranch.address,
        conveniences: clinicBranch.conveniences.map((el) => ({
          id: el.id,
          name: el.name,
        })),
        schedule,
      };

      clinics.push(clinicInfo);
    }

    return {
      clinics,
      totalPages,
    };
  }

  async formScheduleForClinic(
    clinicSchedule: ClinicSchedule[],
    clinicBranchId: string,
  ): Promise<ScheduleClinic[]> {
    const newClinicSchedule: ScheduleClinic[] = [];

    for (let i = 0; i < clinicSchedule.length; i++) {
      const schedule = clinicSchedule[i];
      const hasSchedule = newClinicSchedule.some(
        (el) => el.from === schedule.from && el.to === schedule.to,
      );

      if (hasSchedule) {
        continue;
      }

      const lastColonFrom = schedule.from.lastIndexOf(':');
      const lastColonTo = schedule.to.lastIndexOf(':');

      const from = schedule.from.substring(0, lastColonFrom);
      const to = schedule.to.substring(0, lastColonTo);

      const newSchedule: ScheduleClinic = {
        from: schedule.from,
        to: schedule.to,
        time: from + '-' + to,
        weekDays: [],
        dayType: schedule.dayType,
        weekDayId: schedule.weekDayId,
      };

      const scheduleFromDb: ClinicSchedule[] =
        await this.clinicScheduleService.getByAddressAndTime(
          clinicBranchId,
          schedule.from,
          schedule.to,
        );

      for (let j = 0; j < scheduleFromDb.length; j++) {
        const clinicSchedule = scheduleFromDb[j];
        const weekDay = clinicSchedule.weekDay.name;

        newSchedule.weekDays.push(weekDay);
      }

      newClinicSchedule.push(newSchedule);
    }

    return newClinicSchedule;
  }
}
