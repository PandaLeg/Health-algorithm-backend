import { IBaseRepository } from '../../../../../db/repos/base.repository.interface';
import { AppealType } from '../models/appeal-type.entity';
import { RequestGoal } from '../../../../../base/types/admin.type';

export interface IAppealTypeRepository extends IBaseRepository<AppealType> {
  findOneByName(type: RequestGoal): Promise<AppealType>;
}
