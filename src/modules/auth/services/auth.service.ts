import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { UserService } from '../../user/services/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async registration(userDto: CreateUserDto): Promise<string> {
    const userExists: boolean = await this.userService.checkUserExists(
      userDto.phone,
      userDto.email,
    );

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const saltRounds = 10;
    const hashSalt: string = await bcrypt.genSalt(saltRounds);
    const hashPassword: string = await bcrypt.hash(userDto.password, hashSalt);

    await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });

    return 'User created successfully';
  }
}
