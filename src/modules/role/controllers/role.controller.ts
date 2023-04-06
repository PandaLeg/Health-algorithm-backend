import { Controller, Get, HttpException, Param } from '@nestjs/common';
import { RoleService } from '../services/role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get(':name')
  async getRoleByValue(@Param('name') name: string) {
    try {
      return await this.roleService.getRoleByValue(name);
    } catch (err) {
      throw new HttpException(err.message, err.response.statusCode);
    }
  }
}
