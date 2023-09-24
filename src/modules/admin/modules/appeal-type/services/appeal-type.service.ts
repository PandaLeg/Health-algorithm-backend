import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppealType } from '../models/appeal-type.entity';
import { RequestGoal } from '../../../../../base/types/admin.type';
import { IAppealTypeRepository } from '../repos/appeal-type.repository.interface';

@Injectable()
export class AppealTypeService {
  constructor(
    @Inject('IAppealTypeRepository')
    private appealTypeRepo: IAppealTypeRepository,
  ) {}

  async findTypeByName(type: RequestGoal) {
    const appealType: AppealType = await this.appealTypeRepo.findOneByName(
      type,
    );

    if (!appealType) {
      throw new InternalServerErrorException('Internal server error');
    }

    return appealType;
  }
}
