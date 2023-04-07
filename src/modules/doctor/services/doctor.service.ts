import { Inject, Injectable } from '@nestjs/common';
import { Doctor } from '../models/doctor.entity';

@Injectable()
export class DoctorService {
  constructor(
    @Inject('DOCTORS_REPOSITORY') private doctorRepo: typeof Doctor,
  ) {}
}
