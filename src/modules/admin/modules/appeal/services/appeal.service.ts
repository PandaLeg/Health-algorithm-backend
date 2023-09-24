import { Inject, Injectable } from '@nestjs/common';
import { Appeal } from '../models/appeal.entity';
import { IAppealRepository } from '../repos/appeal.repository.interface';

@Injectable()
export class AppealService {
  constructor(
    @Inject('IAppealRepository') private appealRepo: IAppealRepository,
  ) {}

  async create(typeId: number): Promise<Appeal> {
    const appeal: Appeal = await this.appealRepo.create({
      typeId,
    });

    return appeal;
  }
}
