import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AdminAppealService } from '../services/admin-appeal.service';
import { CreateClinicAppealDto } from '../dto/create-clinic-appeal.dto';

@Controller('appeals')
export class AdminAppealController {
  constructor(private readonly adminAppealService: AdminAppealService) {}

  @Get()
  async getAll() {
    try {
      return await this.adminAppealService.findAll();
    } catch (err) {
      throw new HttpException(
        err.message,
        typeof err.response === 'object'
          ? err.response.statusCode
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async createClinicAppeal(@Body() adminAppealDto: CreateClinicAppealDto) {
    try {
      return await this.adminAppealService.create(adminAppealDto);
    } catch (err) {
      throw new HttpException(
        err.message,
        typeof err.response === 'object'
          ? err.response.statusCode
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id/approve')
  async approveClinicAppeal(@Param('id') id: string) {
    try {
      return await this.adminAppealService.approveClinicAppeal(id);
    } catch (err) {
      throw new HttpException(
        err.message,
        typeof err.response === 'object'
          ? err.response.statusCode
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id/refuse')
  async refuseClinicAppeal(@Param('id') id: string) {
    try {
      return await this.adminAppealService.refuseClinicAppeal(id);
    } catch (err) {
      throw new HttpException(
        err.message,
        typeof err.response === 'object'
          ? err.response.statusCode
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
