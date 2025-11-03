import { IsNotEmpty, IsString } from 'class-validator';
import { RoleCategoryDto } from '../../role-category/model/role-category.dto';

export class RoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  roleCategory: RoleCategoryDto;
}
