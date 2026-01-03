import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoleCategoryService } from '../service/role-category.service';
import { RoleCategoryDto } from '../model/role-category.dto';
import { RoleCategory } from '../model/role-category.schema';
import { CurrentUserId } from '../../../auth/decorators/current-user-id.decorator';

@Controller('role-category')
export class RoleCategoryController {
  constructor(private roleCategoryService: RoleCategoryService) {}

  @Post()
  async addRoleCategory(
    @Body() roleCategoryDto: RoleCategoryDto,
    @CurrentUserId() userId: string,
  ): Promise<RoleCategory> {
    return this.roleCategoryService.create(roleCategoryDto, userId);
  }

  @Get()
  async findAll(): Promise<RoleCategoryDto[]> {
    return this.roleCategoryService.findAll();
  }
}
