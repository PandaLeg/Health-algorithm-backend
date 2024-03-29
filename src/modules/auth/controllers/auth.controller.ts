import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthService } from '../services/auth.service';
import { ValidationCreateUserPipe } from '../pipes/validation-create-user.pipe';
import { HttpExceptionFilter } from '../../../base/exceptions/http-exception.filter';
import { UserCredentialsDto } from '../dto/user-credentials.dto';
import { GeneralValidationPipe } from '../../../base/pipes/general-validation.pipe';
import { IAuthResponse } from '../interfaces/auth-response.interface';
import { Request, Response } from 'express';
import { AuthRefreshGuard } from '../guards/auth-refresh.guard';
import { IUserPayload } from '../interfaces/user-payload.interface';
import { Token } from '../models/token.entity';
import { AuthAccessGuard } from '../guards/auth-access.guard';
import { NotFoundException } from '../../../base/exceptions/not-found.exception';
import { ErrorCodes } from '../../../base/exceptions/error-codes.enum';
import * as process from 'process';
import { IActivation } from '../interfaces/activation.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseIntDoctorPipe } from '../pipes/parse-int-doctor.pipe';
import { BadRequestException } from '../../../base/exceptions/bad-request.exception';
import { UserEmailDto } from '../dto/user-email.dto';
import { UserResetDto } from '../dto/user-reset.dto';
import { ParseJsonUserPipe } from '../pipes/parse-json-user.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/registration')
  @UseFilters(new HttpExceptionFilter())
  @UseInterceptors(FileInterceptor('image'))
  async registration(
    @Body(
      new ParseJsonUserPipe(),
      new ValidationCreateUserPipe(),
      new ParseIntDoctorPipe(),
    )
    userDto: CreateUserDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: new RegExp('image/jpeg|image/png') })
        .addMaxSizeValidator({ maxSize: 5242880 })
        .build({
          fileIsRequired: false,
          exceptionFactory: () => {
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
    @Body(new GeneralValidationPipe())
    userCredentials: UserCredentialsDto,
  ) {
    const authInfo: IAuthResponse = await this.authService.login(
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
    const user: IUserPayload = req.body.user;
    const tokenFromDb: Token = req.body.tokenFromDb;

    const authInfo: IAuthResponse = await this.authService.refresh(
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
    const info: IActivation = await this.authService.activate(code);

    const path = info.isActivated
      ? '/verify-email'
      : '/verify-email?email=' + info.email + '&code=' + ErrorCodes.NOT_FOUND;

    return {
      url: process.env.CLIENT_URL + path,
    };
  }

  @Patch('/send-confirmation-by-email')
  @UseFilters(new HttpExceptionFilter())
  async sendConfirmationByEmail(
    @Body('email', new GeneralValidationPipe()) email: UserEmailDto,
  ) {
    return this.authService.sendConfirmationByEmail(email);
  }

  @Patch('/send-reset-code')
  @UseFilters(new HttpExceptionFilter())
  async sendResetCode(@Body(new GeneralValidationPipe()) user: UserEmailDto) {
    return this.authService.sendResetCode(user);
  }

  @Patch('/reset-password')
  @UseFilters(new HttpExceptionFilter())
  async resetPassword(@Body(new GeneralValidationPipe()) user: UserResetDto) {
    return this.authService.resetPassword(user);
  }
}
