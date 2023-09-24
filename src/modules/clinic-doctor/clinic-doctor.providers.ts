import { ClinicDoctor } from './models/clinic-doctor.entity';
import { ClinicDoctorRepository } from './repos/clinic-doctor.repository';

export const clinicDoctorProviders = [
  {
    provide: 'CLINIC_DOCTOR_REPOSITORY',
    useValue: ClinicDoctor,
  },
  {
    provide: 'IClinicDoctorRepository',
    useClass: ClinicDoctorRepository,
  },
];
