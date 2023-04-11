import { Inject, Injectable } from '@nestjs/common';
import { ClinicAppeal } from '../models/clinic-appeal.entity';
import { Op } from 'sequelize';
import { CreateClinicAppealDto } from '../../appeal/dto/create-clinic-appeal.dto';

@Injectable()
export class ClinicAppealService {
  constructor(
    @Inject('CLINIC_APPEALS_REPOSITORY')
    private clinicAppealRepo: typeof ClinicAppeal,
  ) {}

  async findById(id: string) {
    const clinicAppeal: ClinicAppeal | null =
      await this.clinicAppealRepo.findByPk(id);

    return clinicAppeal;
  }

  async checkAppealExists(phone: string, email: string): Promise<boolean> {
    const clinicAppeal: ClinicAppeal | null =
      await this.clinicAppealRepo.findOne({
        where: {
          [Op.or]: [{ email }, { phone }],
        },
      });

    return !!clinicAppeal;
  }

  async createClinicAppeal(
    appealId: string,
    adminAppealDto: CreateClinicAppealDto,
  ) {
    await this.clinicAppealRepo.create({
      appealId,
      phone: adminAppealDto.phone,
      email: adminAppealDto.email,
      password: adminAppealDto.password,
      name: adminAppealDto.name,
      city: adminAppealDto.city,
    });
  }
}
