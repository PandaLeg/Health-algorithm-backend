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
import { SpecialtyCategory } from '../interfaces/specialty-category.interface';
import { Specialty } from '../models/specialty.entity';
import { User } from '../../user/models/user.entity';
import { IDoctorResponse } from '../interfaces/doctor-response.interface';
import { IDoctor } from '../interfaces/doctor.interface';
import { DescriptionDoctorService } from './description-doctor.service';
import { LastNameDto } from '../dto/last-name.dto';
import { DoctorLocationService } from './doctor-location.service';
import { Sequelize } from 'sequelize-typescript';
import sequelize, { Op, QueryTypes } from 'sequelize';
import { DoctorName } from '../interfaces/doctor-name.interface';
import { DoctorSpecialty } from '../models/doctor-specialty.entity';
import { DoctorLocation } from '../models/doctor-location.entity';
import { PageDto } from '../../../dto/PageDto';
import { DoctorSearchDto } from '../dto/doctor-search.dto';

@Injectable()
export class DoctorService {
  constructor(
    @Inject('DOCTOR_REPOSITORY') private doctorRepo: typeof Doctor,
    @Inject('SEQUELIZE') private sequelize: Sequelize,
    private readonly categoryDoctorService: CategoryDoctorService,
    private readonly specialtyService: SpecialtyService,
    private readonly descriptionDoctorService: DescriptionDoctorService,
    private readonly doctorLocationService: DoctorLocationService,
  ) {}

  buildDoctor(dto: CreateDoctorDto): Doctor {
    return this.doctorRepo.build({
      firstName: dto.firstName,
      lastName: dto.lastName,
      surname: dto.surname,
      dateOfBirth: dto.dateOfBirth,
      experience: dto.experience,
    });
  }

  async findSpecialtiesAndCategory(
    categoryId: number,
    specialties: number[],
  ): Promise<SpecialtyCategory> {
    const category: CategoryDoctor =
      await this.categoryDoctorService.getCategoryById(categoryId);

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

  async createDoctor(
    doctor: Doctor,
    userId: string,
    specialtyCategoryDoctor: SpecialtyCategory,
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

  async getAllDoctors(pageDto: PageDto): Promise<IDoctorResponse> {
    const doctorsFromDb = await this.doctorRepo.findAndCountAll({
      limit: pageDto.perPage,
      offset: pageDto.page,
      distinct: true,
      order: [['userId', 'DESC']],
      attributes: ['userId', 'firstName', 'lastName', 'surname', 'experience'],
      include: [
        { model: User, attributes: ['avatar'] },
        { model: Specialty, attributes: ['id', 'name'] },
        { model: CategoryDoctor, attributes: ['name'] },
      ],
    });

    const totalPages = Math.ceil(doctorsFromDb.count / pageDto.perPage);
    const doctors: IDoctor[] = doctorsFromDb.rows.map((doctor) => ({
      userId: doctor.userId,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      surname: doctor.surname,
      avatar: doctor.user.avatar,
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

  async getNames(lastNameDto: LastNameDto): Promise<DoctorName[]> {
    const lastName: string = lastNameDto.lastName.toLowerCase();
    const city: string = lastNameDto.city.toLowerCase();
    const specialtyId: number | null = lastNameDto.specialtyId ?? null;

    const specialtySubQuery = specialtyId
      ? `and ds."specialtyId" = '${specialtyId}'`
      : '';

    const mainQuery = `
    SELECT DISTINCT d."userId" as "userId", d."firstName" as "firstName", 
    d."lastName" as "lastName"
    FROM doctors as d
    INNER JOIN doctor_specialties as ds on ds."doctorId" = d."userId"
    INNER JOIN doctor_locations as dl on d."userId" = dl."doctorId" 
    WHERE lower(dl.city) = '${city}' and lower(d."lastName") LIKE ('${lastName}%') 
    ${specialtySubQuery}
    GROUP BY d."userId"
    ORDER BY "firstName" DESC
    LIMIT 10`;

    const doctorsNames: DoctorName[] = await this.sequelize.query<DoctorName>(
      mainQuery,
      {
        type: QueryTypes.SELECT,
      },
    );

    return doctorsNames;
  }

  async searchDoctors(
    pageDto: PageDto,
    searchDto: DoctorSearchDto,
  ): Promise<IDoctorResponse> {
    const city: string = searchDto.city.toLowerCase();
    const doctorId: string | null = searchDto.doctorNameId ?? null;
    const specialtyId: number | null = searchDto.specialtyId ?? null;

    return this.findAndCountAll(city, doctorId, specialtyId, pageDto);
  }

  async findAndCountAll(
    city: string,
    doctorId: string | null,
    specialtyId: number | null,
    pageDto: PageDto,
  ): Promise<IDoctorResponse> {
    const doctorSubQuery = doctorId ? `and "userId" = '${doctorId}'` : '';
    const specialtySubQuery = specialtyId
      ? `and ds."specialtyId" = '${specialtyId}'`
      : '';

    const mainQuery = `
    SELECT DISTINCT d."userId" as "userId", d."firstName" as "firstName", 
    d."lastName" as "lastName", d.surname, d.experience, u.avatar, 
    cd.name as "categoryName"
    FROM doctors as d
    INNER JOIN users as u on d."userId" = u.id 
    INNER JOIN categories_doctor as cd on d."categoryId" = cd.id  
    INNER JOIN doctor_specialties as ds on ds."doctorId" = d."userId"
    INNER JOIN doctor_locations as dl on d."userId" = dl."doctorId" 
    WHERE lower(dl.city) = '${city}' ${doctorSubQuery} ${specialtySubQuery}
    GROUP BY u.id, d."userId", cd.name
    ORDER BY "firstName" DESC
    LIMIT ${pageDto.perPage} OFFSET ${pageDto.page}`;

    const countDoctorsQuery = `
    SELECT COUNT(rows."userId") as count
    FROM (
        SELECT DISTINCT
        rows."userId",
        row_number() OVER (PARTITION BY doctor_row) as row
        FROM (
            SELECT
            d."userId",
            row_number() OVER (PARTITION BY d."userId") as doctor_row
            FROM doctors as d
            inner join doctor_specialties as ds on d."userId" = ds."doctorId" 
            inner join doctor_locations as dl on d."userId" = dl."doctorId" 
            where lower(dl.city) = '${city}' ${doctorSubQuery} ${specialtySubQuery}
        ) rows
    ) rows
    WHERE rows.row <= ${pageDto.perPage}`;

    const doctorsFromDb: IDoctor[] = await this.sequelize.query<IDoctor>(
      mainQuery,
      {
        type: QueryTypes.SELECT,
      },
    );
    const countArr = await this.sequelize.query<{ count: string }>(
      countDoctorsQuery,
      {
        type: QueryTypes.SELECT,
      },
    );
    const count = parseInt(countArr[0].count);

    const doctors: IDoctor[] = await Promise.all(
      doctorsFromDb.map(async (doctor) => {
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
    const totalPages = Math.ceil(count / pageDto.perPage);

    return {
      doctors,
      totalPages,
    };
  }
}
