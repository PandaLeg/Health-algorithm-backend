import { Clinic } from './models/clinic.entity';
import { ClinicLocation } from './models/clinic-location.entity';
import { LocationAddress } from './models/location-address.entity';

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
    provide: 'LOCATION_ADDRESS_REPOSITORY',
    useValue: LocationAddress,
  },
];
