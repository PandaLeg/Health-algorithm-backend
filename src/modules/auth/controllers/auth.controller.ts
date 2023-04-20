import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { AuthService } from '../services/auth.service';
import { ValidationCreateUserPipe } from '../pipes/validation-create-user.pipe';
import { HttpExceptionFilter } from '../../../exceptions/http-exception.filter';
import { UserCredentialsDto } from '../dto/user-credentials.dto';
import { ValidationCredentialsUserPipe } from '../pipes/validation-credentials-user.pipe';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { Request, Response } from 'express';
import { AuthRefreshGuard } from '../guards/auth-refresh.guard';
import { UserPayload } from '../interfaces/user-payload.interface';
import { Token } from '../models/token.entity';
import { AuthAccessGuard } from '../guards/auth-access.guard';

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

  @UseGuards(AuthRefreshGuard)
  @UseFilters(new HttpExceptionFilter())
  @Put('/refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const user: UserPayload = req.body.user;
    const tokenFromDb: Token = req.body.tokenFromDb;

    const authInfo: AuthResponse = await this.authService.refresh(
      user,
      tokenFromDb,
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

  @UseGuards(AuthAccessGuard)
  @UseFilters(new HttpExceptionFilter())
  @Delete('/logout')
  async logout(@Req() req: Request) {
    const refreshToken = req.cookies.refreshToken;
    return this.authService.logout(refreshToken);
  }
}
