import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Doctor } from '../models/doctor.entity';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { CategoryDoctorService } from './category-doctor.service';
import { CategoryDoctor } from '../models/category-doctor.entity';
import { SpecialtyService } from './specialty.service';
import { ISpecialtyCategory } from '../interfaces/specialty-category.interface';
import { Specialty } from '../models/specialty.entity';
import { IDoctorResponse } from '../interfaces/doctor-response.interface';
import { IDoctor } from '../interfaces/doctor.interface';
import { DescriptionDoctorService } from './description-doctor.service';
import { LastNameDto } from '../dto/last-name.dto';
import { DoctorLocationService } from './doctor-location.service';
import { IDoctorName } from '../interfaces/doctor-name.interface';
import { PageDto } from '../../../base/dto/PageDto';
import { DoctorSearchDto } from '../dto/doctor-search.dto';
import { NotFoundException } from '../../../base/exceptions/not-found.exception';
import { ErrorCodes } from '../../../base/exceptions/error-codes.enum';
import { IScheduleClinic } from '../../clinic/interfaces/schedule-clinic.interface';
import { ClinicService } from '../../clinic/services/clinic.service';
import { IDoctorClinic } from '../interfaces/doctor-clinic.interface';
import { IDoctorClinicBranch } from '../interfaces/doctor-clinic-branch.inteface';
import { IAppointmentScheduleFromDoctor } from '../interfaces/appointment-schedule.interface';
import { DoctorScheduleService } from './doctor-schedule.service';
import { DoctorSchedule } from '../models/doctor-schedule.entity';
import { IDoctorRepository } from '../repos/doctor.repository.interface';
import { IEntityPagination } from '../../../base/interfaces/entity-pagination.interface';

@Injectable()
export class DoctorService {
  constructor(
    @Inject('IDoctorRepository') private doctorRepo: IDoctorRepository,
    private readonly categoryDoctorService: CategoryDoctorService,
    private readonly specialtyService: SpecialtyService,
    private readonly descriptionDoctorService: DescriptionDoctorService,
    private readonly doctorLocationService: DoctorLocationService,
    private readonly doctorScheduleService: DoctorScheduleService,
    private readonly clinicService: ClinicService,
  ) {}

  buildDoctor(dto: CreateDoctorDto): Doctor {
    return this.doctorRepo.build(dto);
  }

  async findSpecialtiesAndCategory(
    categoryId: number,
    specialties: number[],
  ): Promise<ISpecialtyCategory> {
    const category: CategoryDoctor =
      await this.categoryDoctorService.getCategoryById(categoryId);

    if (!category) {
      throw new InternalServerErrorException('Internal server error');
    }

    const parseSpecialties: { id: number }[] = specialties.map(
      (el: number) => ({
        id: el,
      }),
    );

    const specialtiesFromDb: Specialty[] = await this.specialtyService.getByIds(
      parseSpecialties,
    );

    if (
      !specialtiesFromDb.length ||
      specialtiesFromDb.length !== specialties.length
    ) {
      throw new InternalServerErrorException();
    }

    return {
      specialties,
      categoryId: category.id,
    };
  }

  async getById(id: string): Promise<Doctor> {
    return await this.doctorRepo.findById(id);
  }

  async createDoctor(
    doctor: Doctor,
    userId: string,
    specialtyCategoryDoctor: ISpecialtyCategory,
    doctorDto: CreateDoctorDto,
  ) {
    doctor.userId = userId;
    doctor.categoryId = specialtyCategoryDoctor.categoryId;

    await doctor.save();
    await doctor.$set('specialties', specialtyCategoryDoctor.specialties);
    await this.descriptionDoctorService.create(userId, doctorDto.description);

    const cities = doctorDto.cities;

    for (const city of cities) {
      await this.doctorLocationService.create(userId, city);
    }
  }

  async findCategoriesSpecialties() {
    const specialties: Specialty[] = await this.specialtyService.findAll();
    const categories: CategoryDoctor[] =
      await this.categoryDoctorService.findAll();

    if (!specialties.length || !categories.length) {
      throw new InternalServerErrorException();
    }

    return {
      specialties,
      categories,
    };
  }

  async getAllDoctorsByBranch(
    id: string,
    pageDto: PageDto,
  ): Promise<IEntityPagination<Doctor>> {
    return await this.doctorRepo.findAndCountAllByBranch(id, pageDto);
  }

  async getNames(lastNameDto: LastNameDto): Promise<IDoctorName[]> {
    return await this.doctorRepo.findNamesByCityAndLastName(lastNameDto);
  }

  async searchDoctors(searchDto: DoctorSearchDto): Promise<IDoctorResponse> {
    const pageDto: PageDto = {
      page: searchDto.page,
      perPage: searchDto.perPage,
    };

    const doctorPage: IEntityPagination<IDoctor> =
      await this.doctorRepo.findAndCountAllBySearchParams(pageDto, searchDto);

    const doctors: IDoctor[] = await Promise.all(
      doctorPage.rows.map(async (doctor) => {
        const specialties: Specialty[] =
          await this.specialtyService.findAllByDoctorId(doctor.userId);

        return {
          ...doctor,
          specialties: specialties.map((el) => ({
            id: el.id,
            name: el.name,
          })),
        };
      }),
    );
    const totalPages = Math.ceil(doctorPage.count / searchDto.perPage);

    return {
      doctors,
      totalPages,
      count: doctorPage.count,
    };
  }

  async getDoctorWithClinics(doctorId: string): Promise<IDoctorClinic> {
    const doctorFromDb: Doctor = await this.doctorRepo.findOneByIdWithRelations(
      doctorId,
    );

    if (!doctorFromDb) {
      throw new NotFoundException('Not found', ErrorCodes.NOT_FOUND);
    }

    const doctor: IDoctor = {
      userId: doctorFromDb.userId,
      firstName: doctorFromDb.firstName,
      lastName: doctorFromDb.lastName,
      surname: doctorFromDb.surname,
      avatar: doctorFromDb.user.avatar,
      experience: doctorFromDb.experience,
      categoryName: doctorFromDb.category.name,
      specialties: doctorFromDb.specialties.map((el) => ({
        id: el.id,
        name: el.name,
      })),
      about: doctorFromDb.description.about,
      education: doctorFromDb.description.education,
      course: doctorFromDb.description.course,
    };

    const clinics: IDoctorClinicBranch[] = [];

    for (const clinicBranch of doctorFromDb.clinicBranches) {
      const schedule: IScheduleClinic[] =
        await this.clinicService.formScheduleForClinic(
          clinicBranch.schedules,
          clinicBranch.id,
        );
      const clinicTypeLocation = await this.clinicService.getClinicCityAndType(
        clinicBranch.clinic.clinicTypeId,
        clinicBranch.locationId,
      );

      const clinicInfo: IDoctorClinicBranch = {
        clinicBranchId: clinicBranch.id,
        address: clinicBranch.address,
        conveniences: clinicBranch.conveniences.map((el) => ({
          id: el.id,
          name: el.name,
        })),
        schedule,
        clinicId: clinicBranch.clinicId,
        city: clinicTypeLocation.location.city,
        type: clinicTypeLocation.type.name,
      };

      clinics.push(clinicInfo);
    }

    return {
      doctor,
      clinics,
    };
  }

  async getAppointmentSchedule(
    doctorId: string,
    clinicBranches: string[],
  ): Promise<IAppointmentScheduleFromDoctor[]> {
    const appointmentSchedule: IAppointmentScheduleFromDoctor[] = [];

    for (const clinicBranchId of clinicBranches) {
      const appointment: Partial<IAppointmentScheduleFromDoctor> = {};

      appointment.clinicBranchId = clinicBranchId;

      const scheduleFromDb: DoctorSchedule[] =
        await this.doctorScheduleService.getAllByDoctorAndBranch(
          doctorId,
          clinicBranchId,
        );

      appointment.schedule = scheduleFromDb.map((schedule) => ({
        from: schedule.from,
        to: schedule.to,
        duration: schedule.duration,
        weekDay: { id: schedule.weekDay.id, name: schedule.weekDay.name },
      }));

      appointmentSchedule.push(<IAppointmentScheduleFromDoctor>appointment);
    }

    return appointmentSchedule;
  }
}
