import { Role } from './models/role.entity';

export const roleProviders = [
  {
    provide: 'ROLES_REPOSITORY',
    useValue: Role,
  },
];
