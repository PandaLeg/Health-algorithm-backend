import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as moment from 'moment-timezone';
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
import { IClinicDoctorSchedule } from '../interfaces/clinic-doctor.interface';
import { AppointmentService } from '../../appointment/services/appointment.service';
import { IDoctorScheduleDay } from '../interfaces/doctor-schedule-day.interface';

@Injectable()
export class DoctorService {
  timezone: string;

  constructor(
    @Inject('IDoctorRepository') private doctorRepo: IDoctorRepository,
    private readonly categoryDoctorService: CategoryDoctorService,
    private readonly specialtyService: SpecialtyService,
    private readonly descriptionDoctorService: DescriptionDoctorService,
    private readonly doctorLocationService: DoctorLocationService,
    private readonly doctorScheduleService: DoctorScheduleService,
    private readonly clinicService: ClinicService,
    @Inject(forwardRef(() => AppointmentService))
    private readonly appointmentService: AppointmentService,
  ) {
    this.timezone = 'Europe/Kiev';
  }

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

    await this.doctorLocationService.create(userId, doctorDto.city);
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

        const schedule: IClinicDoctorSchedule[] =
          await this.doctorScheduleService.getAllByDoctorAndCity(
            doctor.userId,
            searchDto.city,
          );

        const scheduleDoctor: IDoctorScheduleDay[] =
          await this.getNearestWorkingDays(schedule, [], 0);

        return {
          ...doctor,
          schedule: scheduleDoctor,
          price: doctor.price / 100,
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

  async getNearestWorkingDays(
    schedule: IClinicDoctorSchedule[],
    scheduleDoctor: any[],
    index: number,
    date?: moment.Moment,
  ): Promise<IDoctorScheduleDay[]> {
    const sh: IClinicDoctorSchedule = schedule[index];
    const weekDay: IDoctorScheduleDay = {
      date: null,
      day: '',
      dayName: '',
      month: '',
      time: [],
    };
    let nearestWorkDay: moment.Moment;

    if (!sh) {
      await this.getNearestWorkingDays(schedule, scheduleDoctor, 0, date);
    }

    if (scheduleDoctor.length < 3) {
      let today: moment.Moment = moment.tz(this.timezone);

      const toTime: moment.Moment = moment.tz(sh.to, 'HH:mm:ss', this.timezone);

      if (date && schedule.length === 1) {
        nearestWorkDay = moment.tz(date, this.timezone);
        today = moment(date).add('1', 'day');
      } else if (date) {
        const dayOfNextWeek: moment.Moment = moment
          .tz(date, this.timezone)
          .day(sh.weekDayName);

        nearestWorkDay = dayOfNextWeek.set({
          hour: toTime.hours(),
          minutes: toTime.minutes(),
        });
      } else {
        nearestWorkDay = moment
          .tz(this.timezone)
          .day(sh.weekDayName)
          .set({ hour: toTime.hours(), minutes: toTime.minutes() });
      }

      if (
        (today.isAfter(nearestWorkDay) &&
          today.day() !== nearestWorkDay.day()) ||
        (date && nearestWorkDay.isBefore(date))
      ) {
        nearestWorkDay = nearestWorkDay.add('7', 'days');
      }

      if (today.isBefore(nearestWorkDay)) {
        const workingHours = await this.formWorkScheduleByHours(
          sh,
          nearestWorkDay,
        );

        if (workingHours.length > 0) {
          weekDay.date = nearestWorkDay.toDate();
          weekDay.day = nearestWorkDay.format('DD');
          weekDay.dayName = nearestWorkDay.format('dddd').substring(0, 3);
          weekDay.month = nearestWorkDay.format('MMM');
          weekDay.time = workingHours;
          scheduleDoctor.push(weekDay);
        }
      }

      await this.getNearestWorkingDays(
        schedule,
        scheduleDoctor,
        index + 1,
        nearestWorkDay,
      );
    }

    return scheduleDoctor;
  }

  async formWorkScheduleByHours(
    sh: IClinicDoctorSchedule,
    nearestWorkDay: moment.Moment,
  ) {
    const baseWorkingHours = this.getWorkingHoursByDuration(sh);
    const appointmentTime = {};
    const appointmentHours: string[] =
      await this.appointmentService.getTimeByDate(
        sh.doctorId,
        nearestWorkDay.format('yyyy-MM-DD'),
      );

    for (const appointmentHour of appointmentHours) {
      const newFormatTime = appointmentHour.substring(0, 5);
      appointmentTime[newFormatTime] = newFormatTime;
    }

    const workingHours =
      baseWorkingHours.reduce((acc, workingHour) => {
        const today = moment.tz(this.timezone);
        const isSameDate =
          nearestWorkDay.toDate().getDate() === today.toDate().getDate() &&
          nearestWorkDay.toDate().getMonth() === today.toDate().getMonth() &&
          nearestWorkDay.toDate().getFullYear() ===
            today.toDate().getFullYear();

        const timePassed =
          isSameDate && today.valueOf() > workingHour.milliseconds;

        return workingHour.time === appointmentTime[workingHour.time] ||
          timePassed ||
          nearestWorkDay.toDate() < today.toDate()
          ? acc
          : [...acc, workingHour.time];
      }, []) ?? [];

    return workingHours;
  }

  getWorkingHoursByDuration(schedule: IClinicDoctorSchedule) {
    const from = moment.tz(schedule.from, 'HH:mm:ss', this.timezone);
    const to = moment.tz(schedule.to, 'HH:mm:ss', this.timezone);

    const workingHours = [
      { time: from.format('HH:mm'), milliseconds: from.valueOf() },
    ];

    for (let i = 0; from < to; i++) {
      const time = from.add(schedule.duration, 'h');
      const timeFormat = time.format('HH:mm');

      const isPossibleAppointment = moment
        .tz(time, this.timezone)
        .add(schedule.duration, 'h');

      if (
        timeFormat < to.format('HH:mm') &&
        isPossibleAppointment.format('HH:mm') <= to.format('HH:mm')
      ) {
        workingHours.push({
          time: timeFormat,
          milliseconds: time.valueOf(),
        });
      }
    }

    return workingHours;
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
      price: doctorFromDb.price / 100,
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
