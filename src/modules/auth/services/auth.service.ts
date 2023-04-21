import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { UserService } from '../../user/services/user.service';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '../../../exceptions/bad-request.exception';
import { ErrorCodes } from '../../../exceptions/error-codes.enum';
import { UserCredentialsDto } from '../dto/user-credentials.dto';
import { User } from '../../user/models/user.entity';
import { TokenService } from './token.service';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { UserPayload } from '../interfaces/user-payload.interface';
import { Token } from '../models/token.entity';
import { NotFoundException } from '../../../exceptions/not-found.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async registration(userDto: CreateUserDto): Promise<string> {
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

    const saltRounds = 10;
    const hashSalt: string = await bcrypt.genSalt(saltRounds);
    const hashPassword: string = await bcrypt.hash(userDto.password, hashSalt);

    await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });

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

    return 'Removed successfully';
  }
}
