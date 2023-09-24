import { AppealType } from './models/appeal-type.entity';
import { AppealTypeRepository } from './repos/appeal-type.repository';

export const appealTypeProviders = [
  {
    provide: 'APPEAL_TYPES_REPOSITORY',
    useValue: AppealType,
  },
  {
    provide: 'IAppealTypeRepository',
    useClass: AppealTypeRepository,
  },
];
