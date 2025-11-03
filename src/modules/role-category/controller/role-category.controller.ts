import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoleCategoryService } from '../service/role-category.service';
import { RoleCategoryDto } from '../model/role-category.dto';

@Controller('role-category')
export class RoleCategoryController {
  constructor(private roleCategoryService: RoleCategoryService) {}

  @Post()
  async addRoleCategory(
    @Body() roleCategoryDto: RoleCategoryDto,
  ): Promise<RoleCategoryDto> {
    return this.roleCategoryService.addRoleCategory(roleCategoryDto);
  }

  @Get()
  async findAll(): Promise<RoleCategoryDto[]> {
    return this.roleCategoryService.findAll();
  }
}
