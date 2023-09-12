import { IBaseRepository } from '../../../db/repos/base.repository.interface';
import { Convenience } from '../models/convenience.entity';

export interface IConvenienceRepository extends IBaseRepository<Convenience> {
  findAllWithAttributes(): Promise<Convenience[]>;
}
