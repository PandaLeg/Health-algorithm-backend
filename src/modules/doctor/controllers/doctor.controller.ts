import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseFilters,
} from '@nestjs/common';
import { DoctorService } from '../services/doctor.service';
import { HttpExceptionFilter } from '../../../exceptions/http-exception.filter';
import { IDoctorResponse } from '../interfaces/doctor-response.interface';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get('/categories-specialties')
  async getAllCategoriesSpecialties() {
    return this.doctorService.findAllCategoriesSpecialties();
  }

  @UseFilters(new HttpExceptionFilter())
  @Get()
  async getAllDoctors(
    @Query('page', ParseIntPipe) page: number,
    @Query('perPage', ParseIntPipe) perPage: number,
  ): Promise<IDoctorResponse> {
    return this.doctorService.getAllDoctors(page, perPage);
  }
}
