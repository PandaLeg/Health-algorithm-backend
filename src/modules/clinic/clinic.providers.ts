import { Clinic } from './models/clinic.entity';
import { ClinicLocation } from './models/clinic-location.entity';
import { ClinicBranch } from './models/clinic-branch.entity';
import { ClinicSchedule } from './models/clinic-schedule.entity';
import { Convenience } from './models/convenience.entity';
import { ClinicConvenience } from './models/clinic-convenience.entity';
import { ClinicType } from './models/clinic-type.entity';

export const clinicProviders = [
  {
    provide: 'CLINICS_REPOSITORY',
    useValue: Clinic,
  },
  {
    provide: 'CLINIC_LOCATION_REPOSITORY',
    useValue: ClinicLocation,
  },
  {
    provide: 'CLINIC_BRANCH_REPOSITORY',
    useValue: ClinicBranch,
  },
  {
    provide: 'CLINIC_SCHEDULE_REPOSITORY',
    useValue: ClinicSchedule,
  },
  {
    provide: 'CONVENIENCE_REPOSITORY',
    useValue: Convenience,
  },
  {
    provide: 'CLINIC_CONVENIENCE_REPOSITORY',
    useValue: ClinicConvenience,
  },
  {
    provide: 'CLINIC_TYPE_REPOSITORY',
    useValue: ClinicType,
  },
];
