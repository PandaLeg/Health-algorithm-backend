import { AppealType } from './models/appeal-type.entity';

export const appealTypeProviders = [
  {
    provide: 'APPEAL_TYPES_REPOSITORY',
    useValue: AppealType,
  },
];
