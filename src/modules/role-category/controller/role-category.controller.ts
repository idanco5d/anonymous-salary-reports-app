import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoleCategoryService } from '../service/role-category.service';
import { RoleCategoryDto } from '../model/role-category.dto';
import { RoleCategory } from '../model/role-category.schema';

@Controller('role-category')
export class RoleCategoryController {
  constructor(private roleCategoryService: RoleCategoryService) {}

  @Post()
  async addRoleCategory(
    @Body() roleCategoryDto: RoleCategoryDto,
  ): Promise<RoleCategory> {
    return this.roleCategoryService.addRoleCategory(roleCategoryDto);
  }

  @Get()
  async findAll(): Promise<RoleCategoryDto[]> {
    return this.roleCategoryService.findAll();
  }
}
