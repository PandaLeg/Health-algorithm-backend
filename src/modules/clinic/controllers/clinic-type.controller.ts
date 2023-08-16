import { Controller, Get, UseFilters } from '@nestjs/common';
import { ClinicTypeService } from '../services/clinic-type.service';
import { HttpExceptionFilter } from '../../../exceptions/http-exception.filter';
import { ClinicType } from '../models/clinic-type.entity';

@Controller('clinic-types')
export class ClinicTypeController {
  constructor(private readonly typeService: ClinicTypeService) {}

  @UseFilters(new HttpExceptionFilter())
  @Get()
  async getAll(): Promise<ClinicType[]> {
    return this.typeService.getAll();
  }
}
