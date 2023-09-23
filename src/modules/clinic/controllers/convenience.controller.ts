import { Controller, Get, UseFilters } from '@nestjs/common';
import { ConvenienceService } from '../services/convenience.service';
import { HttpExceptionFilter } from '../../../base/exceptions/http-exception.filter';
import { Convenience } from '../models/convenience.entity';

@Controller('conveniences')
export class ConvenienceController {
  constructor(private readonly convenienceService: ConvenienceService) {}

  @UseFilters(new HttpExceptionFilter())
  @Get()
  async getAll(): Promise<Convenience[]> {
    return this.convenienceService.getAll();
  }
}
