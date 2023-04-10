import { Inject, Injectable } from '@nestjs/common';
import { Clinic } from '../models/clinic.entity';

@Injectable()
export class ClinicService {
  constructor(
    @Inject('CLINICS_REPOSITORY') private clinicRepo: typeof Clinic,
  ) {}
}
