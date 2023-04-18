import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppealType } from '../models/appeal-type.entity';
import { RequestGoal } from '../../../types/admin.type';

@Injectable()
export class AppealTypeService {
  constructor(
    @Inject('APPEAL_TYPES_REPOSITORY')
    private appealTypeRepo: typeof AppealType,
  ) {}

  async findTypeByName(type: RequestGoal) {
    const appealType: AppealType = await this.appealTypeRepo.findOne({
      where: {
        name: type,
      },
    });

    if (!appealType) {
      throw new InternalServerErrorException('Internal server error');
    }

    return appealType;
  }
}
