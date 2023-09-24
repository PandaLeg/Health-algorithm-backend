import { Appeal } from './models/appeal.entity';
import { AppealRepository } from './repos/appeal.repository';

export const appealProviders = [
  {
    provide: 'APPEALS_REPOSITORY',
    useValue: Appeal,
  },
  {
    provide: 'IAppealRepository',
    useClass: AppealRepository,
  },
];
