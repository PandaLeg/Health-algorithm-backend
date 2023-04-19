import * as moment from 'moment';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../user/models/user.entity';
import { UserPayload } from '../interfaces/user-payload.interface';
import { TokenInfo } from '../interfaces/token-info.interface';
import { Token } from '../models/token.entity';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  MAX_SESSIONS_COUNT = 5;

  constructor(
    @Inject('TOKENS_REPOSITORY') private tokenRepo: typeof Token,
    private readonly jwtService: JwtService,
  ) {}

  async generateAndSaveTokens(user: User): Promise<AuthResponse> {
    const roles: string[] = user.roles.map((role) => role.name);
    const userPayload: UserPayload = {
      id: user.id,
      email: user.email,
      roles,
    };
    const tokens: TokenInfo = await this.generateTokens(userPayload);
    await this.saveTokens(user.id, tokens.refreshToken);

    return {
      user: userPayload,
      tokens,
    };
  }

  async generateTokens(payload: UserPayload): Promise<TokenInfo> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { ...payload },
        {
          secret: process.env.JWT_ACCESS,
          expiresIn: '1m',
        },
      ),
      this.jwtService.sign(
        { ...payload },
        {
          secret: process.env.JWT_REFRESH,
          expiresIn: '2m',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveTokens(userId: string, refreshToken: string) {
    const tokens: Token[] = await this.tokenRepo.findAll({
      where: {
        userId,
      },
    });

    const expiresIn = moment().add(2, 'm').toString();

    if (tokens.length === this.MAX_SESSIONS_COUNT) {
      for (const token of tokens) {
        await this.removeToken(token.id);
      }
    }

    await this.tokenRepo.create({
      userId,
      refreshToken,
      expiresIn,
    });
  }

  async removeToken(id: string) {
    await this.tokenRepo.destroy({
      where: { id },
    });
  }
}
