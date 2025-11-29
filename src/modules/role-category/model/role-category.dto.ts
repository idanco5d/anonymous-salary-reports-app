import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { RoleCategory } from './role-category.schema';
import { Types } from 'mongoose';

export class RoleCategoryDto {
  constructor(roleCategory: RoleCategory) {
    this.id = (roleCategory._id as Types.ObjectId).toString();
    this.name = roleCategory.name;
  }

  @IsMongoId()
  id?: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
