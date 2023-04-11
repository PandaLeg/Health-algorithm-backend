import { Inject, Injectable } from '@nestjs/common';
import { Appeal } from '../models/appeal.entity';
import { ClinicAppeal } from '../../admin/modules/clinic-appeal/models/clinic-appeal.entity';

@Injectable()
export class AppealService {
  constructor(
    @Inject('APPEALS_REPOSITORY') private appealRepo: typeof Appeal,
  ) {}

  async findAllClinicAppeals() {
    return await this.appealRepo.findAll({
      include: [ClinicAppeal],
    });
  }

  async create(typeId: number) {
    const appeal: Appeal = await this.appealRepo.create({
      typeId,
    });

    return appeal;
  }

  async remove(id: string) {
    await this.appealRepo.destroy({
      where: { id },
    });
  }
}
