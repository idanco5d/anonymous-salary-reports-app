import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { RoleCategoryDto } from '../../role-category/model/role-category.dto';
import { Role } from './role.schema';
import { Types } from 'mongoose';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  roleCategory: RoleCategoryDto;
}

export class RoleDto extends CreateRoleDto {
  constructor(role: Role, roleCategoryDto: RoleCategoryDto) {
    super();
    this.id = (role._id as Types.ObjectId).toString();
    this.name = role.name;
    this.roleCategory = roleCategoryDto;
  }

  @IsMongoId()
  id?: string;
}
