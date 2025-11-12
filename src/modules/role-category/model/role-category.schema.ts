import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '../../../common/schemas/base.schema';

@Schema()
export class RoleCategory extends BaseSchema {
  @Prop({ required: true, unique: true })
  name: string;
}

export const RoleCategorySchema = SchemaFactory.createForClass(RoleCategory);
