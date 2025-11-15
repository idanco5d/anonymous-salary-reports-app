import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from '../model/role.schema';
import { Model } from 'mongoose';
import { RoleDto } from '../model/role.dto';
import { RoleCategory } from '../../role-category/model/role-category.schema';
import { RoleCategoryService } from '../../role-category/service/role-category.service';
import { RoleCategoryDto } from '../../role-category/model/role-category.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<Role>,
    private roleCategoryService: RoleCategoryService,
    @InjectModel(RoleCategory.name)
    private roleCategoryModel: Model<RoleCategory>,
  ) {}

  async addRole(roleDto: RoleDto): Promise<Role> {
    const categoryName = roleDto.roleCategory.name;
    let roleCategory: RoleCategory;
    try {
      roleCategory = await this.roleCategoryService.findByName(categoryName);
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        throw error;
      }
      roleCategory = await this.roleCategoryService.addRoleCategory(
        new RoleCategoryDto(categoryName),
      );
    }
    const role = new this.roleModel({
      name: roleDto.name,
      roleCategoryId: roleCategory._id,
      lastUpdatedBy: 'SYSTEM', //TODO switch to current user when auth service is implemented
      createdBy: 'SYSTEM',
    });

    return await role.save();
  }

  async getAllByCategoryName(categoryName: string): Promise<RoleDto[]> {
    const category = await this.roleCategoryModel.findOne({
      name: categoryName,
    });

    if (!category) {
      return [];
    }

    const roles = await this.roleModel.find({ roleCategoryId: category._id });

    return roles.map(
      (it) => new RoleDto(it.name, new RoleCategoryDto(categoryName)),
    );
  }
}
