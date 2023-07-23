import { ClinicDoctor } from './models/clinic-doctor.entity';

export const clinicDoctorProviders = [
  {
    provide: 'CLINIC_DOCTOR_REPOSITORY',
    useValue: ClinicDoctor,
  },
];
