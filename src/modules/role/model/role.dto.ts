import { IsNotEmpty, IsString } from 'class-validator';
import { RoleCategoryDto } from '../../role-category/model/role-category.dto';
import { Role } from './role.schema';

export class RoleDto {
  constructor(role: Role, roleCategoryDto: RoleCategoryDto) {
    this.name = role.name;
    this.roleCategory = roleCategoryDto;
  }

  @IsString()
  @IsNotEmpty()
  name: string;

  roleCategory: RoleCategoryDto;
}
