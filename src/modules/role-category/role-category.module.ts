import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleCategory, RoleCategorySchema } from './model/role-category.schema';
import { RoleCategoryController } from './controller/role-category.controller';
import { RoleCategoryService } from './service/role-category.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RoleCategory.name, schema: RoleCategorySchema },
    ]),
  ],
  controllers: [RoleCategoryController],
  providers: [RoleCategoryService],
  exports: [RoleCategoryService, MongooseModule],
})
export class RoleCategoryModule {}
