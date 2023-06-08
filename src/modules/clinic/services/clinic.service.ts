import { Inject, Injectable } from '@nestjs/common';
import { Clinic } from '../models/clinic.entity';
import { CreateClinicDto } from '../dto/create-clinic.dto';
import { Sequelize } from 'sequelize-typescript';
import { QueryClinic } from '../interfaces/query-clinic.interface';
import { QueryTypes } from 'sequelize';

@Injectable()
export class ClinicService {
  constructor(
    @Inject('CLINICS_REPOSITORY') private clinicRepo: typeof Clinic,
    @Inject('SEQUELIZE') private sequelize: Sequelize,
  ) {}

  async createClinic(userId: string, dto: CreateClinicDto) {
    await this.clinicRepo.create({
      userId,
      ...dto,
    });
  }

  async getAllByQuery(name: string, city: string): Promise<QueryClinic[]> {
    const query = `
    select id, name from clinics as c inner join users as u on c.\"userId\" = u.id where u.city = '${city}' and LOWER(c.name) like LOWER('${name}%')
    `;
    const clinics: QueryClinic[] = await this.sequelize.query<QueryClinic>(
      query,
      { type: QueryTypes.SELECT },
    );

    return clinics;
  }
}
