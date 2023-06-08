import { Controller, Get, Query, UseFilters } from '@nestjs/common';
import { ClinicService } from '../services/clinic.service';
import { HttpExceptionFilter } from '../../../exceptions/http-exception.filter';
import { QueryClinic } from '../interfaces/query-clinic.interface';
import { QueryClinicDto } from '../dto/query-clinic.dto';
import { GeneralValidationPipe } from '../../../pipes/general-validation.pipe';

@Controller('clinics')
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @UseFilters(new HttpExceptionFilter())
  @Get('/by-query')
  async getAllByQuery(
    @Query(new GeneralValidationPipe()) queryClinicDto: QueryClinicDto,
  ): Promise<QueryClinic[]> {
    return this.clinicService.getAllByQuery(
      queryClinicDto.name,
      queryClinicDto.city,
    );
  }
}
