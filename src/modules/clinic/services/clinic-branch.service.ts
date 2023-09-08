import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClinicBranch } from '../models/clinic-branch.entity';
import { ClinicAddressInfo } from '../interfaces/clinic-address-info.interface';
import { ClinicLocation } from '../models/clinic-location.entity';
import { ClinicLocationService } from './clinic-location.service';
import { ClinicSchedule } from '../models/clinic-schedule.entity';
import { Op } from 'sequelize';
import { Convenience } from '../models/convenience.entity';
import { WeekDay } from '../../week-day/models/week-day.entity';
import { BranchSchedule } from '../interfaces/branch-schedule.interface';
import { Clinic } from '../models/clinic.entity';
import { NotFoundException } from '../../../exceptions/not-found.exception';
import { ErrorCodes } from '../../../exceptions/error-codes.enum';
import { AppointmentScheduleFromClinic } from '../../doctor/interfaces/appointment-schedule.interface';
import { DoctorSchedule } from '../../doctor/models/doctor-schedule.entity';
import { Doctor } from '../../doctor/models/doctor.entity';
import { ClinicDoctors } from '../interfaces/clinic-doctors.interface';
import { BadRequestException } from '../../../exceptions/bad-request.exception';
import { DoctorService } from '../../doctor/services/doctor.service';
import { IDoctor } from '../../doctor/interfaces/doctor.interface';
import { PageDto } from '../../../dto/PageDto';

@Injectable()
export class ClinicBranchService {
  constructor(
    @Inject('CLINIC_BRANCH_REPOSITORY')
    private clinicBranchRepo: typeof ClinicBranch,
    private readonly clinicLocationService: ClinicLocationService,
    @Inject(forwardRef(() => DoctorService))
    private readonly doctorService: DoctorService,
  ) {}

  async getAllByLocation(locationId: string): Promise<ClinicBranch[]> {
    const branches: ClinicBranch[] = await this.clinicBranchRepo.findAll({
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

    if (!branches.length) {
      throw new NotFoundException('Not found', ErrorCodes.NOT_FOUND);
    }

    return branches;
  }

  async getById(id: string): Promise<ClinicBranch> {
    const branch: ClinicBranch = await this.clinicBranchRepo.findByPk(id, {
      include: [
        {
          model: Clinic,
          attributes: ['userId'],
        },
      ],
    });

    return branch;
  }

  async getByIdWithSchedule(id: string): Promise<ClinicBranch> {
    const branch: ClinicBranch = await this.clinicBranchRepo.findByPk(id, {
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

    if (!branch) {
      throw new NotFoundException('Not found', ErrorCodes.NOT_FOUND);
    }

    return branch;
  }

  async getFirstByLocation(locationId: string): Promise<ClinicBranch> {
    const branch: ClinicBranch | null = await this.clinicBranchRepo.findOne({
      where: {
        locationId,
      },
    });

    if (!branch) {
      throw new NotFoundException('Not found', ErrorCodes.NOT_FOUND);
    }

    return branch;
  }

  async create(locationId: string, clinicId: string, address: string) {
    return await this.clinicBranchRepo.create({
      locationId,
      clinicId,
      address,
    });
  }

  async getClinicAddresses(
    clinicId: string,
    city: string,
  ): Promise<ClinicAddressInfo[]> {
    const location: ClinicLocation | null =
      await this.clinicLocationService.getByClinicIdAndCity(clinicId, city);

    const clinicBranches: ClinicBranch[] = await this.getAllByLocation(
      location.id,
    );

    return clinicBranches.map((branch): ClinicAddressInfo => {
      const branchSchedule: BranchSchedule[] = branch.schedules.map(
        (schedule) => ({
          from: schedule.from,
          to: schedule.to,
          weekDayId: schedule.weekDayId,
        }),
      );
      const days: { id: number; name: string }[] = branch.schedules.map(
        (schedule) => ({
          id: schedule.weekDay.id,
          name: schedule.weekDay.name,
        }),
      );

      return {
        id: branch.id,
        address: branch.address,
        days,
        schedule: branchSchedule,
      };
    });
  }

  async getAllByLocationWithSchedule(
    locationId: string,
    clinicBranchId: string,
    page: number,
    perPage: number,
  ) {
    const branches = await this.clinicBranchRepo.findAndCountAll({
      limit: perPage,
      offset: page,
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

    if (!branches) {
      throw new InternalServerErrorException();
    }

    return branches;
  }

  async getClinicDoctorSchedule(
    id: string,
  ): Promise<AppointmentScheduleFromClinic[]> {
    const clinicBranch: ClinicBranch = await this.clinicBranchRepo.findByPk(
      id,
      {
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
      },
    );

    const appointmentSchedule: AppointmentScheduleFromClinic[] =
      clinicBranch.doctors.map((doctor) => ({
        doctorId: doctor.userId,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        schedule: doctor.schedules,
      }));

    return appointmentSchedule;
  }

  async getClinicDoctors(id: string, pageDto: PageDto): Promise<ClinicDoctors> {
    const clinicBranch: ClinicBranch = await this.clinicBranchRepo.findByPk(
      id,
      {
        attributes: ['id'],
      },
    );

    if (!clinicBranch) {
      throw new BadRequestException(
        'Data incorrect',
        ErrorCodes.DATA_INCORRECT,
      );
    }

    const doctorsFromDb = await this.doctorService.getAllDoctorsByBranch(
      id,
      pageDto,
    );

    const totalPages = Math.ceil(doctorsFromDb.count / 5);
    const doctors: IDoctor[] = doctorsFromDb.rows.map((doctor) => ({
      userId: doctor.userId,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      surname: doctor.surname,
      avatar: null,
      experience: doctor.experience,
      categoryName: doctor.category.name,
      specialties: doctor.specialties.map((el) => ({
        id: el.id,
        name: el.name,
      })),
    }));

    return {
      doctors,
      totalPages,
    };
  }
}
