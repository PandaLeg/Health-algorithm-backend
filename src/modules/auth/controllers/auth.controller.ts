import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { AuthService } from '../services/auth.service';
import { ValidationCreateUserPipe } from '../pipes/validation-create-user.pipe';
import { HttpExceptionFilter } from '../../../exceptions/http-exception.filter';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/registration')
  @UseFilters(new HttpExceptionFilter())
  async registration(
    @Body(new ValidationCreateUserPipe()) userDto: CreateUserDto,
  ) {
    return this.authService.registration(userDto);
  }
}
