import { BaseRepository } from '../../../base/repos/base.repository';
import { Role } from '../models/role.entity';
import { IRoleRepository } from './role.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RoleRepository
  extends BaseRepository<Role>
  implements IRoleRepository
{
  constructor(@Inject('ROLES_REPOSITORY') private roleRepo: typeof Role) {
    super(roleRepo);
  }

  findByName(name: string): Promise<Role> {
    return this.roleRepo.findOne({
      where: {
        name,
      },
    });
  }
}
