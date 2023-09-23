import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '../services/token.service';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const token = request.headers.authorization.split(' ')[1];

      const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (!requiredRoles) {
        return true;
      }

      const user = await this.tokenService.validateToken(
        token,
        process.env.JWT_ACCESS,
      );

      return user.roles.some((role: string) => requiredRoles.includes(role));
    } catch (err) {
      throw new ForbiddenException('Forbidden');
    }
  }
}
