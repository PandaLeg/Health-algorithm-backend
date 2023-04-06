import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() userDto: CreateUserDto) {
    try {
      return await this.userService.createUser(userDto);
    } catch (err) {
      throw new HttpException(err.response.message, err.response.statusCode);
    }
  }
}
