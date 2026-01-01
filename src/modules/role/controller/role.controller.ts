import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoleDto } from '../model/role.dto';
import { RoleService } from '../service/role.service';
import { Role } from '../model/role.schema';

@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  async addRole(@Body() roleDto: RoleDto): Promise<Role> {
    return this.roleService.addRole(roleDto);
  }

  @Get('/category/:categoryId')
  async getAllByCategoryId(
    @Param('categoryId') categoryId: string,
  ): Promise<RoleDto[]> {
    return this.roleService.findAllByCategoryId(categoryId);
  }
}
