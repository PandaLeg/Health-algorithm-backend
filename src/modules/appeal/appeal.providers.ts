import { Appeal } from './models/appeal.entity';

export const appealProviders = [
  {
    provide: 'APPEALS_REPOSITORY',
    useValue: Appeal,
  },
];
