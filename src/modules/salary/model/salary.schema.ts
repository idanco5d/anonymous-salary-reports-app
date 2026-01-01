import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '../../../common/schemas/base.schema';
import { Types } from 'mongoose';
import { Role } from '../../role/model/role.schema';
import { Education } from './education';
import { EmployerType } from './employerType';

@Schema()
export class Salary extends BaseSchema {
  @Prop({ required: true, min: 0 })
  baseSalary: number;

  @Prop({ required: true, min: 0 })
  extras: number;

  @Prop({ type: Types.ObjectId, ref: Role.name, required: true })
  roleId: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  experienceYears: number;

  @Prop({ type: String, enum: Education, required: true })
  education: Education;

  @Prop({ required: true })
  educationInRelevantField: boolean;

  @Prop({ min: 12 })
  vacationDays?: number;

  @Prop({ type: String, enum: EmployerType, required: true })
  employerType: EmployerType;

  @Prop({
    required: true,
    type: [{ type: Types.ObjectId, ref: 'User' }],
    default: [],
  })
  likedBy: Types.ObjectId[];

  @Prop({
    required: true,
    type: [{ type: Types.ObjectId, ref: 'User' }],
    default: [],
  })
  dislikedBy: Types.ObjectId[];

  @Prop({ min: 1900, max: new Date().getFullYear() })
  startYear?: number;

  @Prop({ min: 1900, max: new Date().getFullYear() })
  endYear?: number;
}

export const SalarySchema = SchemaFactory.createForClass(Salary);
