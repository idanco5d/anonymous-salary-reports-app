import { IsNotEmpty, IsString } from 'class-validator';
import { RoleCategoryDto } from '../../role-category/model/role-category.dto';

export class RoleDto {
  constructor(name: string, roleCategoryDto: RoleCategoryDto) {
    this.name = name;
    this.roleCategory = roleCategoryDto;
  }

  @IsString()
  @IsNotEmpty()
  name: string;

  roleCategory: RoleCategoryDto;
}
