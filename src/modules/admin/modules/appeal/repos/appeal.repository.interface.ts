import { IBaseRepository } from '../../../../../db/repos/base.repository.interface';
import { Appeal } from '../models/appeal.entity';

export interface IAppealRepository extends IBaseRepository<Appeal> {}
