import * as moment from 'moment';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../user/models/user.entity';
import { UserPayload } from '../interfaces/user-payload.interface';
import { TokenInfo } from '../interfaces/token-info.interface';
import { Token } from '../models/token.entity';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { JwtService } from '@nestjs/jwt';
import * as process from 'process';
import { ITokenRepository } from '../repos/token.repository.interface';

@Injectable()
export class TokenService {
  MAX_SESSIONS_COUNT = 5;

  constructor(
    @Inject('ITokenRepository') private tokenRepo: ITokenRepository,
    private readonly jwtService: JwtService,
  ) {}

  async findOneByToken(refreshToken: string): Promise<Token | null> {
    return await this.tokenRepo.findOneByRefreshToken(refreshToken);
  }

  async generateAndSaveTokens(
    user: User,
    refreshToken: Token | null,
  ): Promise<AuthResponse> {
    const roles: string[] = user.roles.map((role) => role.name);
    const userPayload: UserPayload = {
      id: user.id,
      email: user.email,
      roles,
    };
    const tokens: TokenInfo = await this.generateTokens(userPayload);
    await this.saveTokens(user.id, tokens.refreshToken, refreshToken);

    return {
      user: { ...userPayload, phone: user.phone },
      tokens,
    };
  }

  async generateTokens(payload: UserPayload): Promise<TokenInfo> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { ...payload },
        {
          secret: process.env.JWT_ACCESS,
          expiresIn: '1h',
        },
      ),
      this.jwtService.sign(
        { ...payload },
        {
          secret: process.env.JWT_REFRESH,
          expiresIn: '10h',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveTokens(
    userId: string,
    refreshToken: string,
    oldToken: Token | null,
  ) {
    const tokens: Token[] = await this.tokenRepo.findAllByUser(userId);

    const expiresIn = moment().add(10, 'h').toString();

    if (tokens.length === this.MAX_SESSIONS_COUNT) {
      for (const token of tokens) {
        const isExpired: boolean = moment().isAfter(token.expiresIn);
        if (isExpired) {
          await this.removeToken(token.id);
        }
      }
    }

    if (oldToken) {
      oldToken.refreshToken = refreshToken;
      oldToken.expiresIn = expiresIn;

      await oldToken.save();
    } else {
      await this.tokenRepo.create({
        userId,
        refreshToken,
        expiresIn,
      });
    }
  }

  async validateToken(token: string, secretKey: string) {
    return await this.jwtService.verifyAsync(token, {
      secret: secretKey,
    });
  }

  async removeToken(id: string | number) {
    await this.tokenRepo.remove('id', id);
  }
}
