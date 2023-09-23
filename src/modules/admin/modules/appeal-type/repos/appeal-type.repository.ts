import { BaseRepository } from '../../../../../db/repos/base.repository';
import { AppealType } from '../models/appeal-type.entity';
import { IAppealTypeRepository } from './appeal-type.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { RequestGoal } from '../../../../../base/types/admin.type';

@Injectable()
export class AppealTypeRepository
  extends BaseRepository<AppealType>
  implements IAppealTypeRepository
{
  constructor(
    @Inject('APPEAL_TYPES_REPOSITORY')
    private appealTypeRepo: typeof AppealType,
  ) {
    super(appealTypeRepo);
  }

  findOneByName(type: RequestGoal): Promise<AppealType> {
    return this.appealTypeRepo.findOne({
      where: {
        name: type,
      },
    });
  }
}
