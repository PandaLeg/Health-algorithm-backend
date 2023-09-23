import { IBaseRepository } from '../../../db/repos/base.repository.interface';
import { User } from '../models/user.entity';
import { MultipleUserProps, UserProp } from '../../../base/types/user.type';
import { CreateUserDto } from '../../auth/dto/create-user.dto';

export interface IUserRepository extends IBaseRepository<User> {
  findAllWithRole(): Promise<User[]>;

  findByIdWithRole(id: string): Promise<User>;

  findOneByUserProp(key: UserProp, value: string): Promise<User>;

  findOneByUserProps(fields: MultipleUserProps[]): Promise<User>;

  findOneByPhoneOrEmail(phone: string, email: string): Promise<User>;

  buildUser(userDto: CreateUserDto): User;
}
