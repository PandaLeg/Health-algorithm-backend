import { Token } from './models/token.entity';

export const authProviders = [
  {
    provide: 'TOKENS_REPOSITORY',
    useValue: Token,
  },
];
