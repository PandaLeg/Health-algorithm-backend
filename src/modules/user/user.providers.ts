import { User } from './models/user.entity';
import { UserRepository } from './repos/user.repository';
import { Role } from './models/role.entity';
import { UserRole } from './models/user-roles.entity';
import { RoleRepository } from './repos/role.repository';

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useValue: User,
  },
  {
    provide: 'ROLES_REPOSITORY',
    useValue: Role,
  },
  {
    provide: 'USER_ROLE_REPOSITORY',
    useValue: UserRole,
  },
  {
    provide: 'IUserRepository',
    useClass: UserRepository,
  },
  {
    provide: 'IRoleRepository',
    useClass: RoleRepository,
  },
];
