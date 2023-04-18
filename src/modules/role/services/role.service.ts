import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Role } from '../models/role.entity';

@Injectable()
export class RoleService {
  constructor(@Inject('ROLES_REPOSITORY') private roleRepo: typeof Role) {}

  async getRoleByValue(name: string) {
    const role: Role | null = await this.roleRepo.findOne({
      where: {
        name,
      },
    });

    if (!role) {
      throw new InternalServerErrorException('Internal server error');
    }

    return role;
  }
}
