import { BaseRepository } from '../../../../../db/repos/base.repository';
import { Appeal } from '../models/appeal.entity';
import { IAppealRepository } from './appeal.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppealRepository
  extends BaseRepository<Appeal>
  implements IAppealRepository
{
  constructor(@Inject('APPEALS_REPOSITORY') private appealRepo: typeof Appeal) {
    super(appealRepo);
  }
}
