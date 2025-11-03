import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { RoleCategory } from '../../role-category/model/role-category.schema';

@Schema()
export class Role extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: RoleCategory.name, required: true })
  roleCategory: RoleCategory;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
