import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../services/token.service';
import { Request } from 'express';

@Injectable()
export class AuthRefreshGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const refreshToken = request.cookies.refreshToken;

    const tokenFromDb = await this.tokenService.findOneByToken(refreshToken);

    if (!tokenFromDb) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.tokenService.validateToken(refreshToken);

      request.body['user'] = { ...payload };
      request.body['tokenFromDb'] = tokenFromDb;
    } catch (err) {
      await this.tokenService.removeToken(tokenFromDb.id);
      throw new UnauthorizedException();
    }

    return true;
  }
}
