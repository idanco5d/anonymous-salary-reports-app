import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { RoleCategory } from './role-category.schema';
import { Types } from 'mongoose';

export class CreateRoleCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class RoleCategoryDto extends CreateRoleCategoryDto {
  constructor(roleCategory: RoleCategory) {
    super();
    this.id = (roleCategory._id as Types.ObjectId).toString();
    this.name = roleCategory.name;
  }

  @IsMongoId()
  id?: string;
}
