import { User } from './models/user.entity';

export const userProviders = [
  {
    provide: 'USERS_REPOSITORY',
    useValue: User,
  },
];
