import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { RoleCategory } from '../../role-category/model/role-category.schema';
import { BaseSchema } from '../../../common/schemas/base.schema';

@Schema()
export class Role extends BaseSchema {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: RoleCategory.name, required: true })
  roleCategoryId: Types.ObjectId;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
