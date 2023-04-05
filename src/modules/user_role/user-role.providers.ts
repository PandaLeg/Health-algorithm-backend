import { UserRoles } from './models/user-roles.entity';

export const userRoleProviders = [
  {
    provide: 'USER_ROLES_REPOSITORY',
    useValue: UserRoles,
  },
];
