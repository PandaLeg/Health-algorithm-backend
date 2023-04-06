import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/registration')
  async registration(@Body() userDto: CreateUserDto) {
    try {
      return await this.authService.registration(userDto);
    } catch (err) {
      throw new HttpException(
        err.message,
        typeof err.response === 'object'
          ? err.response.statusCode
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
