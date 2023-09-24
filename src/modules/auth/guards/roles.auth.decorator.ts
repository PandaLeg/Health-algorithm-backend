import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthAccessGuard } from './auth-access.guard';
import { RolesGuard } from './roles.guard';

export const ROLES_KEY = 'roles';

export function Auth(...roles: string[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(AuthAccessGuard, RolesGuard),
  );
}
