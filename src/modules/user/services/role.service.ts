import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Role } from '../models/role.entity';
import { IRoleRepository } from '../repos/role.repository.interface';

@Injectable()
export class RoleService {
  constructor(@Inject('IRoleRepository') private roleRepo: IRoleRepository) {}

  async getRoleByValue(name: string): Promise<Role> {
    const role: Role = await this.roleRepo.findByName(name);

    if (!role) {
      throw new InternalServerErrorException();
    }

    return role;
  }
}
