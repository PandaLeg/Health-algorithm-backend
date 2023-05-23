import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserService } from '../../user/services/user.service';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import * as cryptoRandomString from 'crypto-random-string';
import { BadRequestException } from '../../../exceptions/bad-request.exception';
import { ErrorCodes } from '../../../exceptions/error-codes.enum';
import { UserCredentialsDto } from '../dto/user-credentials.dto';
import { User } from '../../user/models/user.entity';
import { TokenService } from './token.service';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { UserPayload } from '../interfaces/user-payload.interface';
import { Token } from '../models/token.entity';
import { NotFoundException } from '../../../exceptions/not-found.exception';
import { MailService } from './mail.service';
import { Activation } from '../interfaces/activation.interface';
import hashPassword from '../../../utils/hashPassword';
import { UserEmailDto } from '../dto/user-email.dto';
import { UserResetDto } from '../dto/user-reset.dto';
import { MultipleUserProps } from '../../../types/user.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
  ) {}

  async registration(
    userDto: CreateUserDto,
    image?: Express.Multer.File,
  ): Promise<string> {
    const userExists: boolean = await this.userService.checkUserExists(
      userDto.phone,
      userDto.email,
    );

    if (userExists) {
      throw new BadRequestException(
        'User already exists',
        ErrorCodes.INVALID_VALIDATION,
      );
    }

    const hashedPassword: string = await hashPassword(userDto.password);

    const user: User = await this.userService.createUser(
      {
        ...userDto,
        password: hashedPassword,
      },
      image,
    );

    const activationCode: string = cryptoRandomString({
      length: 30,
      type: 'url-safe',
    });
    await this.mailService.sendActivationCode(user.email, activationCode);

    user.activationCode = activationCode;
    await user.save();

    return 'User created successfully';
  }

  async login(userCredentials: UserCredentialsDto): Promise<AuthResponse> {
    const user: User | null = await this.userService.findOne(
      'phone',
      userCredentials.phone,
    );

    if (!user) {
      throw new BadRequestException(
        'Incorrect phone or password',
        ErrorCodes.INCORRECT_PHONE_PASSWORD,
      );
    }

    const isPasswordEquals: boolean = await bcrypt.compare(
      userCredentials.password,
      user.password,
    );

    if (!isPasswordEquals) {
      throw new BadRequestException(
        'Incorrect phone or password',
        ErrorCodes.INCORRECT_PHONE_PASSWORD,
      );
    }

    return this.tokenService.generateAndSaveTokens(user, null);
  }

  async refresh(user: UserPayload, refreshToken: Token): Promise<AuthResponse> {
    const userFromDb: User | null = await this.userService.findById(user.id);

    if (!userFromDb) {
      throw new UnauthorizedException();
    }

    return this.tokenService.generateAndSaveTokens(userFromDb, refreshToken);
  }

  async logout(refreshToken: string): Promise<string> {
    const token: Token | null = await this.tokenService.findOneByToken(
      refreshToken,
    );

    if (!token) {
      throw new NotFoundException('Not found', ErrorCodes.NOT_FOUND);
    }

    await this.tokenService.removeToken(token.id);

    return 'Logout successfully';
  }

  async activate(code: string): Promise<Activation> {
    const user: User | null = await this.userService.findOne(
      'activationCode',
      code,
    );

    if (!user || user.isActivated) {
      return { email: user.email, isActivated: false };
    }

    user.isActivated = true;
    await user.save();

    return { isActivated: true };
  }

  async sendConfirmationByEmail(user: UserEmailDto) {
    const userFromDb: User | null = await this.userService.findOne(
      'email',
      user.email,
    );

    if (!userFromDb || userFromDb.isActivated) {
      throw new BadRequestException(
        'Wrong email or account is already activated',
        ErrorCodes.USER_ALREADY_ACTIVATED,
      );
    }

    const activationCode: string = cryptoRandomString({
      length: 30,
      type: 'url-safe',
    });
    await this.mailService.sendActivationCode(userFromDb.email, activationCode);

    userFromDb.activationCode = activationCode;
    await userFromDb.save();

    return 'The activation code was sent successfully';
  }

  async sendResetCode(user: UserEmailDto): Promise<string> {
    const userFromDb: User | null = await this.userService.findOne(
      'email',
      user.email,
    );

    if (!userFromDb) {
      throw new BadRequestException(
        'Data incorrect',
        ErrorCodes.DATA_INCORRECT,
      );
    }

    const resetCode: string = cryptoRandomString({
      length: 80,
      type: 'url-safe',
    });
    const codeExpired = moment().add(1, 'h').toString();

    await this.mailService.sendResetCode(
      userFromDb.email,
      userFromDb.id,
      resetCode,
    );

    userFromDb.resetCode = resetCode;
    userFromDb.resetCodeExpired = codeExpired;

    await userFromDb.save();

    return 'The reset code was sent successfully';
  }

  async resetPassword(user: UserResetDto): Promise<string> {
    const fields: MultipleUserProps[] = [
      { id: user.id },
      { resetCode: user.code },
    ];
    const userFromDb: User | null =
      await this.userService.findOneByMultipleFields(fields);

    if (!userFromDb) {
      throw new BadRequestException(
        'Data incorrect',
        ErrorCodes.DATA_INCORRECT,
      );
    }

    const isExpired = moment().isAfter(userFromDb.resetCodeExpired);

    if (isExpired) {
      throw new BadRequestException(
        'Reset code is expired',
        ErrorCodes.RESET_CODE_IS_EXPIRED,
      );
    }

    const hashedPassword: string = await hashPassword(user.password);

    userFromDb.password = hashedPassword;
    userFromDb.resetCode = null;
    userFromDb.resetCodeExpired = null;

    await userFromDb.save();

    return 'Password changed';
  }
}
