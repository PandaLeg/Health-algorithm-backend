import { Controller, Get } from '@nestjs/common';
import { DoctorService } from '../services/doctor.service';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get('/categories-specialties')
  async getAllCategoriesSpecialties() {
    return this.doctorService.findAllCategoriesSpecialties();
  }
}
