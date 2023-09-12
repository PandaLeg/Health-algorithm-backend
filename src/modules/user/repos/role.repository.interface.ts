import { Role } from '../models/role.entity';
import { IBaseRepository } from '../../../base/repos/base.repository.interface';

export interface IRoleRepository extends IBaseRepository<Role> {
  findByName(name: string): Promise<Role>;
}
