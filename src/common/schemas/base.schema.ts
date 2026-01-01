import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class BaseSchema extends Document {
  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: true })
  lastUpdatedBy: string;

  createdAt: Date;
  updatedAt: Date;
}
