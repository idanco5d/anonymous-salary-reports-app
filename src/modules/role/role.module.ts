import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './model/role.schema';
import { RoleCategoryModule } from '../role-category/role-category.module';
import {
  RoleCategory,
  RoleCategorySchema,
} from '../role-category/model/role-category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      { name: RoleCategory.name, schema: RoleCategorySchema },
    ]),
    RoleCategoryModule,
  ],
})
export class RoleModule {}
