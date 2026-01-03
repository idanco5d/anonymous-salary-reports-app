import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(
    roleCategoryDto: RoleCategoryDto,
    userId: string,
  ): Promise<RoleCategory> {
    const roleCategory = new this.roleCategoryModel({
      name: roleCategoryDto.name,
      lastUpdatedBy: userId,
      createdBy: userId,
    });

    return await roleCategory.save();
  }

  async findAll(): Promise<RoleCategoryDto[]> {
    const roleCategories = await this.roleCategoryModel.find();
    return roleCategories.map((it) => new RoleCategoryDto(it));
  }

  async findByName(name: string): Promise<RoleCategory> {
    const roleCategory = await this.roleCategoryModel.findOne({ name });
    if (!roleCategory) {
      throw new NotFoundException('No such category');
    }

    return roleCategory;
  }

  async findById(_id: string): Promise<RoleCategory> {
    const roleCategory = await this.roleCategoryModel.findOne({ _id });
    if (!roleCategory) {
      throw new NotFoundException('No such category');
    }

    return roleCategory;
  }
}
