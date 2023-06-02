import { Inject, Injectable } from '@nestjs/common';
import { Appeal } from '../models/appeal.entity';

@Injectable()
export class AppealService {
  constructor(
    @Inject('APPEALS_REPOSITORY') private appealRepo: typeof Appeal,
  ) {}

  async create(typeId: number) {
    const appeal: Appeal = await this.appealRepo.create({
      typeId,
    });

    return appeal;
  }
}
