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
    private roleCategoryService: RoleCategoryService,

    @InjectModel(Role.name)
    private roleModel: Model<Role>,
  ) {}

  async addRole(roleDto: RoleDto): Promise<Role> {
    let roleCategory: RoleCategory;
    if (roleDto.roleCategory.id !== undefined) {
      roleCategory = await this.roleCategoryService.findById(
        roleDto.roleCategory.id.toString(),
      );
    } else {
      roleCategory = await this.roleCategoryService.addRoleCategory(
        roleDto.roleCategory,
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

  async findAllByCategoryId(categoryId: string): Promise<RoleDto[]> {
    const category = await this.roleCategoryService.findById(categoryId);
    const roles = await this.roleModel.find({ roleCategoryId: category._id });

    if (roles.length === 0) {
      throw new NotFoundException('Role not found');
    }

    return roles.map((it) => new RoleDto(it, new RoleCategoryDto(category)));
  }

  async findDtoById(_id: string): Promise<RoleDto> {
    const role = await this.roleModel.findOne({ _id });
    if (!role) throw new NotFoundException('Role not found');
    const category = await this.roleCategoryService.findById(
      role.roleCategoryId.toString(),
    );

    return new RoleDto(role, new RoleCategoryDto(category));
  }
}
