import { UserRole } from './models/user-roles.entity';

export const userRoleProviders = [
  {
    provide: 'USER_ROLE_REPOSITORY',
    useValue: UserRole,
  },
];
