import { Clinic } from './models/clinic.entity';
import { ClinicLocation } from './models/clinic-location.entity';
import { ClinicBranch } from './models/clinic-branch.entity';
import { ClinicSchedule } from './models/clinic-schedule.entity';
import { Convenience } from './models/convenience.entity';
import { ClinicConvenience } from './models/clinic-convenience.entity';
import { ClinicType } from './models/clinic-type.entity';
import { ClinicRepository } from './repos/clinic.repository';
import { ClinicLocationRepository } from './repos/clinic-location.repository';
import { ClinicBranchRepository } from './repos/clinic-branch.repository';
import { ClinicConvenienceRepository } from './repos/clinic-convenience.repository';
import { ClinicScheduleRepository } from './repos/clinic-schedule.repository';
import { ClinicTypeRepository } from './repos/clinic-type.repository';
import { ConvenienceRepository } from './repos/convenience.repository';

export const clinicProviders = [
  {
    provide: 'CLINICS_REPOSITORY',
    useValue: Clinic,
  },
  {
    provide: 'IClinicRepository',
    useClass: ClinicRepository,
  },
  {
    provide: 'CLINIC_LOCATION_REPOSITORY',
    useValue: ClinicLocation,
  },
  {
    provide: 'IClinicLocationRepository',
    useClass: ClinicLocationRepository,
  },
  {
    provide: 'CLINIC_BRANCH_REPOSITORY',
    useValue: ClinicBranch,
  },
  {
    provide: 'IClinicBranchRepository',
    useClass: ClinicBranchRepository,
  },
  {
    provide: 'CLINIC_SCHEDULE_REPOSITORY',
    useValue: ClinicSchedule,
  },
  {
    provide: 'IClinicScheduleRepository',
    useClass: ClinicScheduleRepository,
  },
  {
    provide: 'CONVENIENCE_REPOSITORY',
    useValue: Convenience,
  },
  {
    provide: 'IConvenienceRepository',
    useClass: ConvenienceRepository,
  },
  {
    provide: 'CLINIC_CONVENIENCE_REPOSITORY',
    useValue: ClinicConvenience,
  },
  {
    provide: 'IClinicConvenienceRepository',
    useClass: ClinicConvenienceRepository,
  },
  {
    provide: 'CLINIC_TYPE_REPOSITORY',
    useValue: ClinicType,
  },
  {
    provide: 'IClinicTypeRepository',
    useClass: ClinicTypeRepository,
  },
];
