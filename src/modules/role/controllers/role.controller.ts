import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { HttpExceptionFilter } from '../../../exceptions/http-exception.filter';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get(':name')
  @UseFilters(new HttpExceptionFilter())
  async getRoleByValue(@Param('name') name: string) {
    return this.roleService.getRoleByValue(name);
  }
}
