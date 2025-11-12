import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from '../model/role.schema';
import { Model } from 'mongoose';
import { RoleDto } from '../model/role.dto';
import { RoleCategory } from '../../role-category/model/role-category.schema';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<Role>,
    @InjectModel(RoleCategory.name)
    private roleCategoryModel: Model<RoleCategory>,
  ) {}

  async addRole(roleDto: RoleDto): Promise<RoleDto> {
    const role = new this.roleModel({
      name: roleDto.name,
      roleCategory: roleDto.roleCategory,
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

    const roles = await this.roleModel
      .find({ roleCategory: category._id })
      .populate('roleCategory');

    return roles.map((it) => it.toDto());
  }
}
