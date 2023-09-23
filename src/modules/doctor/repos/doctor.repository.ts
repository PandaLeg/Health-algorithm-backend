import { BaseRepository } from '../../../db/repos/base.repository';
import { Doctor } from '../models/doctor.entity';
import { IDoctorRepository } from './doctor.repository.interface';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { Inject, Injectable } from '@nestjs/common';
import { IEntityPagination } from '../../../base/interfaces/entity-pagination.interface';
import { User } from '../../user/models/user.entity';
import { Specialty } from '../models/specialty.entity';
import { CategoryDoctor } from '../models/category-doctor.entity';
import { PageDto } from '../../../base/dto/PageDto';
import { ClinicBranch } from '../../clinic/models/clinic-branch.entity';
import { IDoctorName } from '../interfaces/doctor-name.interface';
import { QueryTypes } from 'sequelize';
import { LastNameDto } from '../dto/last-name.dto';
import { Sequelize } from 'sequelize-typescript';
import { IDoctor } from '../interfaces/doctor.interface';
import { DoctorSearchDto } from '../dto/doctor-search.dto';
import { DescriptionDoctor } from '../models/description-doctor.entity';
import { Clinic } from '../../clinic/models/clinic.entity';
import { Convenience } from '../../clinic/models/convenience.entity';
import { ClinicSchedule } from '../../clinic/models/clinic-schedule.entity';

@Injectable()
export class DoctorRepository
  extends BaseRepository<Doctor>
  implements IDoctorRepository
{
  constructor(
    @Inject('DOCTOR_REPOSITORY') private doctorRepo: typeof Doctor,
    @Inject('SEQUELIZE') private sequelize: Sequelize,
  ) {
    super(doctorRepo);
  }

  build(dto: CreateDoctorDto): Doctor {
    return this.doctorRepo.build({
      firstName: dto.firstName,
      lastName: dto.lastName,
      surname: dto.surname,
      dateOfBirth: dto.dateOfBirth,
      experience: dto.experience,
      price: dto.price,
    });
  }

  findAndCountAll(pageDto: PageDto): Promise<IEntityPagination<Doctor>> {
    return this.doctorRepo.findAndCountAll({
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
  }

  findAndCountAllByBranch(
    id: string,
    pageDto: PageDto,
  ): Promise<IEntityPagination<Doctor>> {
    return this.doctorRepo.findAndCountAll({
      limit: pageDto.perPage,
      offset: pageDto.page,
      distinct: true,
      order: [['userId', 'DESC']],
      attributes: ['userId', 'firstName', 'lastName', 'surname', 'experience'],
      include: [
        { model: ClinicBranch, attributes: ['id'], where: { id } },
        { model: Specialty, attributes: ['id', 'name'] },
        { model: CategoryDoctor, attributes: ['name'] },
      ],
    });
  }

  findNamesByCityAndLastName(lastNameDto: LastNameDto): Promise<IDoctorName[]> {
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

    return this.sequelize.query<IDoctorName>(mainQuery, {
      type: QueryTypes.SELECT,
    });
  }

  async findAndCountAllBySearchParams(
    pageDto: PageDto,
    searchDto: DoctorSearchDto,
  ): Promise<IEntityPagination<IDoctor>> {
    const city: string = searchDto.city.toLowerCase();
    const doctorId: string | null = searchDto.doctorNameId ?? null;
    const specialtyId: number | null = searchDto.specialtyId ?? null;

    const doctorSubQuery = doctorId ? `and "userId" = '${doctorId}'` : '';
    const specialtySubQuery = specialtyId
      ? `and ds."specialtyId" = '${specialtyId}'`
      : '';

    const mainQuery = `
    SELECT DISTINCT d."userId" as "userId", d."firstName" as "firstName", 
    d."lastName" as "lastName", dd.about, d.surname, d.price, d.experience, u.avatar, 
    cd.name as "categoryName"
    FROM doctors as d
    INNER JOIN users as u on d."userId" = u.id 
    INNER JOIN categories_doctor as cd on d."categoryId" = cd.id
    INNER JOIN description_doctors as dd on d."userId" = dd."doctorId"   
    INNER JOIN doctor_specialties as ds on d."userId" = ds."doctorId"
    INNER JOIN doctor_locations as dl on d."userId" = dl."doctorId" 
    WHERE lower(dl.city) = '${city}' ${doctorSubQuery} ${specialtySubQuery}
    GROUP BY u.id, d."userId", cd.name, dd.about
    ORDER BY "firstName" DESC
    LIMIT ${pageDto.perPage} OFFSET ${pageDto.page}`;

    const countDoctorsQuery = `
    SELECT COUNT(rows.row) as count
    FROM (
        SELECT
        row_number() OVER (PARTITION BY user_id) as row
        FROM (
            SELECT
            DISTINCT
            d."userId" as user_id
            FROM doctors as d
            inner join doctor_specialties as ds on d."userId" = ds."doctorId" 
            inner join doctor_locations as dl on d."userId" = dl."doctorId" 
            where lower(dl.city) = '${city}' ${doctorSubQuery} ${specialtySubQuery}
        ) rows
    ) rows`;

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

    return {
      rows: doctorsFromDb,
      count,
    };
  }

  findOneByIdWithRelations(doctorId: string): Promise<Doctor> {
    return this.doctorRepo.findOne({
      where: {
        userId: doctorId,
      },
      attributes: [
        'userId',
        'firstName',
        'lastName',
        'surname',
        'price',
        'experience',
      ],
      include: [
        { model: User, attributes: ['avatar'] },
        { model: Specialty, attributes: ['id', 'name'] },
        { model: CategoryDoctor, attributes: ['name'] },
        {
          model: DescriptionDoctor,
          attributes: ['about', 'education', 'course'],
        },
        {
          model: ClinicBranch,
          include: [
            {
              model: Clinic,
              attributes: ['userId', 'clinicTypeId'],
            },
            {
              model: Convenience,
              attributes: ['id', 'name'],
            },
            {
              model: ClinicSchedule,
              attributes: ['dayType', 'from', 'to', 'weekDayId'],
            },
          ],
        },
      ],
    });
  }
}
