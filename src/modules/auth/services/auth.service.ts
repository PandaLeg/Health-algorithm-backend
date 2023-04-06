import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { User } from '../../user/models/user.entity';
import { UserService } from '../../user/services/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async registration(userDto: CreateUserDto) {
    const userFromDb: User | null = await this.userService.checkUserExists(
      userDto.phone,
      userDto.email,
    );

    if (userFromDb) {
      throw new BadRequestException('User already exists');
    }

    const saltRounds = 10;
    const hashSalt: string = await bcrypt.genSalt(saltRounds);
    const hashPassword: string = await bcrypt.hash(userDto.password, hashSalt);

    const message: string = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });

    return message;
  }
}
