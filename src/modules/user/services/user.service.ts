import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { User } from '../models/user.entity';

@Injectable()
export class UserService {
  constructor(@Inject('USERS_REPOSITORY') private userRepo: typeof User) {}

  async getAll() {
    return await this.userRepo.findAll();
  }

  async getById(id: string) {
    const user: User | null = await this.userRepo.findByPk(id);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return {};
  }

  async createUser() {

  }
}
