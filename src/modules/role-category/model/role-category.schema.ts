import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class RoleCategory extends Document {
  @Prop({ required: true, unique: true })
  name: string;
}

export const RoleCategorySchema = SchemaFactory.createForClass(RoleCategory);
