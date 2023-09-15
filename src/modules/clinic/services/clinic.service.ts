import { Inject, Injectable } from '@nestjs/common';
import { Clinic } from '../models/clinic.entity';
import { CreateClinicDto } from '../dto/create-clinic.dto';
import { IClinicInfo } from '../interfaces/clinic-info.interface';
import { ClinicLocationService } from './clinic-location.service';
import { ClinicLocation } from '../models/clinic-location.entity';
import { ClinicBranchService } from './clinic-branch.service';
import { ClinicBranch } from '../models/clinic-branch.entity';
import { ClinicScheduleService } from './clinic-schedule.service';
import { ClinicBranchDto } from '../dto/clinic-branch.dto';
import { ClinicConvenienceService } from './clinic-convenience.service';
import { IClinicSearch } from '../interfaces/clinic-search.interface';
import { ClinicType } from '../models/clinic-type.entity';
import { IClinicSearchPage } from '../interfaces/clinic-search-page.interface';
import { IClinicFullInfo } from '../interfaces/clinic-full-info.interface';
import { ClinicSchedule } from '../models/clinic-schedule.entity';
import { IScheduleClinic } from '../interfaces/schedule-clinic.interface';
import { NotFoundException } from '../../../base/exceptions/not-found.exception';
import { ErrorCodes } from '../../../base/exceptions/error-codes.enum';
import { IClinicBranchFullInfo } from '../interfaces/clinic-branch-full-info.interface';
import { ClinicTypeService } from './clinic-type.service';
import { IClinicRepository } from '../repos/clinic.repository.interface';
import { PageDto } from '../../../base/dto/PageDto';
import { IEntityPagination } from '../../../base/interfaces/entity-pagination.interface';
import { CurrentClinicBranchDto } from '../dto/current-clinic-branch.dto';

@Injectable()
export class ClinicService {
  constructor(
    @Inject('IClinicRepository') private clinicRepo: IClinicRepository,
    private readonly clinicLocationService: ClinicLocationService,
    private readonly clinicBranchService: ClinicBranchService,
    private readonly clinicScheduleService: ClinicScheduleService,
    private readonly clinicConvenienceService: ClinicConvenienceService,
    private readonly clinicTypeService: ClinicTypeService,
  ) {}

  async getByName(name: string): Promise<Clinic | null> {
    return await this.clinicRepo.findOneByName(name);
  }

  async searchClinicsByCity(
    city: string,
    pageDto: PageDto,
  ): Promise<IClinicSearchPage> {
    city = city.toLowerCase();

    const clinicPage: IEntityPagination<Clinic> =
      await this.clinicRepo.findAndCountAllByCity(city, pageDto);

    const totalPages = Math.ceil(clinicPage.count / pageDto.perPage);
    const clinics: IClinicSearch[] = [];

    for (const el of clinicPage.rows) {
      const locationId: string = el.locations[0].id;
      const clinicBranch: ClinicBranch =
        await this.clinicBranchService.getFirstByLocation(locationId);

      const clinic: IClinicSearch = {
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

    const countClinicBranches: number =
      await this.clinicBranchService.totalClinicsNumberByCity(city);

    return {
      clinics,
      totalPages,
      count: countClinicBranches,
    };
  }

  async searchClinicByIdAndCity(
    id: string,
    city: string,
  ): Promise<IClinicSearch> {
    const clinicFromDb: Clinic = await this.clinicRepo.findOneById(id);

    const location: ClinicLocation =
      await this.clinicLocationService.getByClinicIdAndCity(
        clinicFromDb.userId,
        city,
      );

    const clinicBranchId: string = location.clinicBranches[0].id;

    const clinic: IClinicSearch = {
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
    const clinic: Clinic = this.clinicRepo.build(userId, dto);
    await clinic.save();

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

  async getAllByCityAndName(
    city: string,
    name: string,
  ): Promise<IClinicInfo[]> {
    return await this.clinicRepo.findAllByCityAndName(city, name);
  }

  async getFullInfoClinic(
    id: string,
    city: string,
    clinicBranchId: string,
  ): Promise<IClinicFullInfo> {
    const clinicFromDb: Clinic = await this.clinicRepo.findOneById(id);

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

    const newSchedules: IScheduleClinic[] = await this.formScheduleForClinic(
      clinicBranch.schedules,
      clinicBranchId,
    );

    const clinic: IClinicFullInfo = {
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

  async getFullInfoClinics(currentClinicDto: CurrentClinicBranchDto) {
    const clinicFromDb: Clinic = await this.clinicRepo.findById(
      currentClinicDto.id,
    );
    const pageDto: PageDto = {
      page: currentClinicDto.page,
      perPage: currentClinicDto.perPage,
    };

    if (!clinicFromDb) {
      throw new NotFoundException('Not found', ErrorCodes.NOT_FOUND);
    }

    const location: ClinicLocation =
      await this.clinicLocationService.getByClinicIdAndCity(
        clinicFromDb.userId,
        currentClinicDto.city,
      );

    const clinicBranches =
      await this.clinicBranchService.getAllByLocationWithSchedule(
        location.id,
        currentClinicDto.clinicBranchId,
        pageDto,
      );

    const clinics = await this.formClinicBranches(clinicBranches.rows);

    const totalPages = Math.ceil(
      clinicBranches.count / currentClinicDto.perPage,
    );

    return {
      clinics,
      totalPages,
    };
  }

  async formClinicBranches(clinicBranches: ClinicBranch[]) {
    const clinics: IClinicBranchFullInfo[] = [];

    for (const clinicBranch of clinicBranches) {
      const schedule: IScheduleClinic[] = await this.formScheduleForClinic(
        clinicBranch.schedules,
        clinicBranch.id,
      );

      const clinicInfo: IClinicBranchFullInfo = {
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

    return clinics;
  }

  async formScheduleForClinic(
    clinicSchedule: ClinicSchedule[],
    clinicBranchId: string,
  ): Promise<IScheduleClinic[]> {
    const newClinicSchedule: IScheduleClinic[] = [];

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

      const newSchedule: IScheduleClinic = {
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
        const weekDay = {
          id: clinicSchedule.weekDay.id,
          name: clinicSchedule.weekDay.name,
        };

        newSchedule.weekDays.push(weekDay);
      }

      newClinicSchedule.push(newSchedule);
    }

    return newClinicSchedule;
  }

  async getClinicCityAndType(id: number, locationId: string) {
    const type: ClinicType = await this.clinicTypeService.getById(id);
    const location: ClinicLocation = await this.clinicLocationService.getById(
      locationId,
    );

    return {
      type,
      location,
    };
  }
}
