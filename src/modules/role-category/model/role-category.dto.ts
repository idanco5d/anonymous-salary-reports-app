import { IsNotEmpty, IsString } from 'class-validator';
import { RoleCategory } from './role-category.schema';

export class RoleCategoryDto {
  constructor(roleCategory: RoleCategory) {
    this.name = roleCategory.name;
  }

  @IsString()
  @IsNotEmpty()
  name: string;
}
