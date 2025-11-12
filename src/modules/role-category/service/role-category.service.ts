import { Injectable } from '@nestjs/common';
import { RoleCategoryDto } from '../model/role-category.dto';
import { RoleCategory } from '../model/role-category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RoleCategoryService {
  constructor(
    @InjectModel(RoleCategory.name)
    private roleCategoryModel: Model<RoleCategory>,
  ) {}

  async addRoleCategory(
    roleCategoryDto: RoleCategoryDto,
  ): Promise<RoleCategoryDto> {
    const roleCategory = new this.roleCategoryModel({
      name: roleCategoryDto.name,
      lastUpdatedBy: 'SYSTEM', //TODO switch to current user when auth service is implemented
      createdBy: 'SYSTEM',
    });

    return await roleCategory.save();
  }

  async findAll(): Promise<RoleCategoryDto[]> {
    const roleCategories = await this.roleCategoryModel.find();
    return roleCategories.map((it) => new RoleCategoryDto(it.name));
  }
}
