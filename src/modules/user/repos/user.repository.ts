import { BaseRepository } from '../../../base/repos/base.repository';
import { User } from '../models/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from './user.repository.interface';
import { CreateUserDto } from '../../auth/dto/create-user.dto';
import { MultipleUserProps, UserProp } from '../../../types/user.type';
import { Role } from '../models/role.entity';
import { Op } from 'sequelize';

@Injectable()
export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  constructor(@Inject('USER_REPOSITORY') private userRepo: typeof User) {
    super(userRepo);
  }

  buildUser(userDto: CreateUserDto): User {
    return this.userRepo.build({
      phone: userDto.phone,
      password: userDto.password,
      email: userDto.email,
    });
  }

  findAllWithRole(): Promise<User[]> {
    return this.userRepo.findAll({
      include: [
        {
          model: Role,
          attributes: ['id', 'name'],
        },
      ],
    });
  }

  findByIdWithRole(id: string): Promise<User> {
    return this.userRepo.findByPk(id, {
      include: [
        {
          model: Role,
          attributes: ['id', 'name'],
        },
      ],
    });
  }

  findOneByPhoneOrEmail(phone: string, email: string): Promise<User> {
    return this.userRepo.findOne({
      where: {
        [Op.or]: [{ phone }, { email }],
      },
    });
  }

  findOneByUserProp(key: UserProp, value: string): Promise<User> {
    return this.userRepo.findOne({
      where: {
        [key]: value,
      },
      include: [
        {
          model: Role,
          attributes: ['id', 'name'],
        },
      ],
    });
  }

  findOneByUserProps(fields: MultipleUserProps[]): Promise<User> {
    return this.userRepo.findOne({
      where: {
        [Op.and]: fields,
      },
      include: [
        {
          model: Role,
          attributes: ['id', 'name'],
        },
      ],
    });
  }
}
