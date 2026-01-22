import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RoleCategoryService } from '../service/role-category.service';
import {
  CreateRoleCategoryDto,
  RoleCategoryDto,
} from '../model/role-category.dto';
import { RoleCategory } from '../model/role-category.schema';
import { CurrentUserId } from '../../../auth/decorators/current-user-id.decorator';
import { JwtAuthAdminGuard } from '../../../auth/guards/jwt-auth-admin.guard';

@Controller('role-category')
export class RoleCategoryController {
  constructor(private roleCategoryService: RoleCategoryService) {}

  @Post()
  @UseGuards(JwtAuthAdminGuard)
  async addRoleCategory(
    @Body() roleCategoryDto: CreateRoleCategoryDto,
    @CurrentUserId() userId: string,
  ): Promise<RoleCategory> {
    return this.roleCategoryService.create(roleCategoryDto, userId);
  }

  @Get()
  async findAll(): Promise<RoleCategoryDto[]> {
    return this.roleCategoryService.findAll();
  }
}
