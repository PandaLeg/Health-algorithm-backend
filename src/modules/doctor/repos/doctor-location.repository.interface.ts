import { IBaseRepository } from '../../../base/repos/base.repository.interface';
import { DoctorLocation } from '../models/doctor-location.entity';

export interface IDoctorLocationRepository
  extends IBaseRepository<DoctorLocation> {}
