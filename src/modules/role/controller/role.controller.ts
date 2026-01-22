import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateRoleDto, RoleDto } from '../model/role.dto';
import { RoleService } from '../service/role.service';
import { Role } from '../model/role.schema';
import { CurrentUserId } from '../../../auth/decorators/current-user-id.decorator';
import { JwtAuthAdminGuard } from '../../../auth/guards/jwt-auth-admin.guard';

@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  @UseGuards(JwtAuthAdminGuard)
  async addRole(
    @Body() roleDto: CreateRoleDto,
    @CurrentUserId() userId: string,
  ): Promise<Role> {
    return this.roleService.create(roleDto, userId);
  }

  @Get('/category/:categoryId')
  async getAllByCategoryId(
    @Param('categoryId') categoryId: string,
  ): Promise<RoleDto[]> {
    return this.roleService.findAllByCategoryId(categoryId);
  }
}
