import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus, InternalServerErrorException,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Put,
  Redirect,
  Req,
  Res,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors
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
import { NotFoundException } from '../../../exceptions/not-found.exception';
import { ErrorCodes } from '../../../exceptions/error-codes.enum';
import * as process from 'process';
import { Activation } from '../interfaces/activation.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseIntDoctorPipe } from '../pipes/parse-int-doctor.pipe';
import { BadRequestException } from '../../../exceptions/bad-request.exception';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/registration')
  @UseFilters(new HttpExceptionFilter())
  @UseInterceptors(FileInterceptor('image'))
  async registration(
    @Body(new ValidationCreateUserPipe(), new ParseIntDoctorPipe())
    userDto: CreateUserDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image/jpeg' })
        .addMaxSizeValidator({ maxSize: 5242880 })
        .build({
          fileIsRequired: false,
          exceptionFactory: (error) => {
            console.log(error);
            return new BadRequestException(
              'Image incorrect',
              ErrorCodes.IMAGE_INCORRECT,
            );
          },
        }),
    )
    image?: Express.Multer.File,
  ) {
    return this.authService.registration(userDto, image);
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

    if (!refreshToken) {
      throw new NotFoundException('Not found', ErrorCodes.NOT_FOUND);
    }

    return this.authService.logout(refreshToken);
  }

  @Get('/activate/:code')
  @Redirect()
  async activate(@Param('code') code: string) {
    const info: Activation = await this.authService.activate(code);

    const path = info.isActivated
      ? '/verify-email'
      : '/verify-email?email=' + info.email + '&code=' + ErrorCodes.NOT_FOUND;

    return {
      url: process.env.CLIENT_URL + path,
    };
  }

  @Patch('/send-confirmation-by-email')
  @UseFilters(new HttpExceptionFilter())
  async sendConfirmationByEmail(@Body('email') email: string) {
    if (!email) {
      throw new BadRequestException(
        'Validation failed',
        ErrorCodes.INVALID_VALIDATION,
      );
    }
    return this.authService.sendConfirmationByEmail(email);
  }
}
