import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { RoleCategory } from '../../role-category/model/role-category.schema';
import { BaseSchema } from '../../../common/schemas/base.schema';
import { RoleDto } from './role.dto';
import { RoleCategoryDto } from '../../role-category/model/role-category.dto';

@Schema()
export class Role extends BaseSchema {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: RoleCategory.name, required: true })
  roleCategory: RoleCategory;

  toDto(): RoleDto {
    return new RoleDto(this.name, new RoleCategoryDto(this.roleCategory.name));
  }
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.methods.toDto = function (this: Role) {
  return new RoleDto(this.name, new RoleCategoryDto(this.roleCategory.name));
};
