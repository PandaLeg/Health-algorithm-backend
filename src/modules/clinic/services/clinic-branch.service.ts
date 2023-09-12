import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ClinicBranch } from '../models/clinic-branch.entity';
import { IClinicAddressInfo } from '../interfaces/clinic-address-info.interface';
import { ClinicLocation } from '../models/clinic-location.entity';
import { ClinicLocationService } from './clinic-location.service';
import { IBranchSchedule } from '../interfaces/branch-schedule.interface';
import { NotFoundException } from '../../../base/exceptions/not-found.exception';
import { ErrorCodes } from '../../../base/exceptions/error-codes.enum';
import { IAppointmentScheduleFromClinic } from '../../doctor/interfaces/appointment-schedule.interface';
import { Doctor } from '../../doctor/models/doctor.entity';
import { IClinicDoctors } from '../interfaces/clinic-doctors.interface';
import { BadRequestException } from '../../../base/exceptions/bad-request.exception';
import { DoctorService } from '../../doctor/services/doctor.service';
import { IDoctor } from '../../doctor/interfaces/doctor.interface';
import { PageDto } from '../../../base/dto/PageDto';
import { IClinicBranchRepository } from '../repos/clinic-branch.repository.interface';
import { IEntityPagination } from '../../../base/interfaces/entity-pagination.interface';

@Injectable()
export class ClinicBranchService {
  constructor(
    @Inject('IClinicBranchRepository')
    private clinicBranchRepo: IClinicBranchRepository,
    private readonly clinicLocationService: ClinicLocationService,
    @Inject(forwardRef(() => DoctorService))
    private readonly doctorService: DoctorService,
  ) {}

  async getAllByLocation(locationId: string): Promise<ClinicBranch[]> {
    const branches: ClinicBranch[] =
      await this.clinicBranchRepo.findAllByLocation(locationId);

    if (!branches.length) {
      throw new NotFoundException('Not found', ErrorCodes.NOT_FOUND);
    }

    return branches;
  }

  async getById(id: string): Promise<ClinicBranch> {
    return this.clinicBranchRepo.findByIdWithClinic(id);
  }

  async getByIdWithSchedule(id: string): Promise<ClinicBranch> {
    const branch: ClinicBranch =
      await this.clinicBranchRepo.findByIdWithSchedule(id);

    if (!branch) {
      throw new NotFoundException('Not found', ErrorCodes.NOT_FOUND);
    }

    return branch;
  }

  async getFirstByLocation(locationId: string): Promise<ClinicBranch> {
    const branch: ClinicBranch =
      await this.clinicBranchRepo.findFirstByLocation(locationId);

    if (!branch) {
      throw new NotFoundException('Not found', ErrorCodes.NOT_FOUND);
    }

    return branch;
  }

  async create(
    locationId: string,
    clinicId: string,
    address: string,
  ): Promise<ClinicBranch> {
    return await this.clinicBranchRepo.create({
      locationId,
      clinicId,
      address,
    });
  }

  async getClinicAddresses(
    clinicId: string,
    city: string,
  ): Promise<IClinicAddressInfo[]> {
    const location: ClinicLocation | null =
      await this.clinicLocationService.getByClinicIdAndCity(clinicId, city);

    const clinicBranches: ClinicBranch[] = await this.getAllByLocation(
      location.id,
    );

    return clinicBranches.map((branch): IClinicAddressInfo => {
      const branchSchedule: IBranchSchedule[] = branch.schedules.map(
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
    pageDto: PageDto,
  ) {
    return await this.clinicBranchRepo.findAndCountAllByLocationWithoutCurrent(
      locationId,
      clinicBranchId,
      pageDto,
    );
  }

  async getClinicDoctorSchedule(
    id: string,
  ): Promise<IAppointmentScheduleFromClinic[]> {
    const clinicBranch: ClinicBranch =
      await this.clinicBranchRepo.findByIdWithDoctor(id);

    const appointmentSchedule: IAppointmentScheduleFromClinic[] =
      clinicBranch.doctors.map((doctor) => ({
        doctorId: doctor.userId,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        schedule: doctor.schedules,
      }));

    return appointmentSchedule;
  }

  async getClinicDoctors(
    id: string,
    pageDto: PageDto,
  ): Promise<IClinicDoctors> {
    const clinicBranch: ClinicBranch =
      await this.clinicBranchRepo.findByIdWithAttributes(id);

    if (!clinicBranch) {
      throw new BadRequestException(
        'Data incorrect',
        ErrorCodes.DATA_INCORRECT,
      );
    }

    const doctorPage: IEntityPagination<Doctor> =
      await this.doctorService.getAllDoctorsByBranch(id, pageDto);

    const totalPages = Math.ceil(doctorPage.count / 5);
    const doctors: IDoctor[] = doctorPage.rows.map((doctor) => ({
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
