import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../db/repos/base.repository';
import { Clinic } from '../models/clinic.entity';
import { IClinicRepository } from './clinic.repository.interface';
import { CreateClinicDto } from '../dto/create-clinic.dto';
import { PageDto } from '../../../base/dto/PageDto';
import { IEntityPagination } from '../../../base/interfaces/entity-pagination.interface';
import { ClinicLocation } from '../models/clinic-location.entity';
import { User } from '../../user/models/user.entity';
import { ClinicType } from '../models/clinic-type.entity';
import { Sequelize } from 'sequelize-typescript';
import { IClinicInfo } from '../interfaces/clinic-info.interface';
import { QueryTypes } from 'sequelize';

@Injectable()
export class ClinicRepository
  extends BaseRepository<Clinic>
  implements IClinicRepository
{
  constructor(
    @Inject('CLINICS_REPOSITORY') private clinicRepo: typeof Clinic,
    @Inject('SEQUELIZE') private sequelize: Sequelize,
  ) {
    super(clinicRepo);
  }

  findOneByName(name: string): Promise<Clinic> {
    return this.clinicRepo.findOne({
      where: {
        name,
      },
    });
  }

  build(userId: string, dto: CreateClinicDto): Clinic {
    return this.clinicRepo.build({
      userId,
      name: dto.name,
      description: dto.description,
      clinicTypeId: dto.clinicType,
    });
  }

  findAndCountAllByCity(
    city: string,
    pageDto: PageDto,
  ): Promise<IEntityPagination<Clinic>> {
    return this.clinicRepo.findAndCountAll({
      limit: pageDto.perPage,
      offset: pageDto.page,
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
  }

  findOneById(id: string): Promise<Clinic> {
    return this.clinicRepo.findOne({
      where: { userId: id },
      include: [
        { model: User, attributes: ['avatar'] },
        { model: ClinicType, attributes: ['name'] },
      ],
    });
  }

  findAllByCityAndName(city: string, name: string): Promise<IClinicInfo[]> {
    const query = `
    SELECT c."userId" as "clinicId", c.name
    FROM clinics as c 
    INNER JOIN users as u on c."userId" = u.id 
    INNER JOIN clinic_locations as cl on c."userId" = cl."clinicId"
    where cl.city = '${city}' and LOWER(c.name) like LOWER('${name}%')
    `;

    return this.sequelize.query<IClinicInfo>(query, {
      type: QueryTypes.SELECT,
    });
  }
}
