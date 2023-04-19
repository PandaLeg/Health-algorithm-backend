import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseFilters } from '@nestjs/common';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { AuthService } from '../services/auth.service';
import { ValidationCreateUserPipe } from '../pipes/validation-create-user.pipe';
import { HttpExceptionFilter } from '../../../exceptions/http-exception.filter';
import { UserCredentialsDto } from '../dto/user-credentials.dto';
import { ValidationCredentialsUserPipe } from '../pipes/validation-credentials-user.pipe';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  @UseFilters(new HttpExceptionFilter())
  async login(
    @Res() res: Response,
    @Body(new ValidationCredentialsUserPipe())
    userCredentials: UserCredentialsDto,
  ) {
    const authInfo: AuthResponse = await this.authService.login(
      userCredentials,
    );
    const ageCookie: number = 30 * 24 * 60 * 60 * 1000;

    res.cookie('refreshToken', authInfo.tokens.refreshToken, {
      maxAge: ageCookie,
      httpOnly: true,
    });

    return res.json({
      user: authInfo.user,
      accessToken: authInfo.tokens.accessToken,
    });
  }

  @Post('/registration')
  @UseFilters(new HttpExceptionFilter())
  async registration(
    @Body(new ValidationCreateUserPipe()) userDto: CreateUserDto,
  ) {
    return this.authService.registration(userDto);
  }
}
