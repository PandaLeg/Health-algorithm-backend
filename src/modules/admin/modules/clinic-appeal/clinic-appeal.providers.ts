import { ClinicAppeal } from './models/clinic-appeal.entity';

export const clinicAppealProviders = [
  {
    provide: 'CLINIC_APPEALS_REPOSITORY',
    useValue: ClinicAppeal,
  },
];
