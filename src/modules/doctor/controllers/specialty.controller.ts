import { Controller, Get, UseFilters } from '@nestjs/common';
import { SpecialtyService } from '../services/specialty.service';
import { HttpExceptionFilter } from '../../../base/exceptions/http-exception.filter';
import { Specialty } from '../models/specialty.entity';

@Controller('specialties')
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) {}

  @UseFilters(new HttpExceptionFilter())
  @Get()
  async getAll(): Promise<Specialty[]> {
    return this.specialtyService.findAll();
  }
}
