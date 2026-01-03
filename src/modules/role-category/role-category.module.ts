import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleCategory, RoleCategorySchema } from './model/role-category.schema';
import { RoleCategoryController } from './controller/role-category.controller';
import { RoleCategoryService } from './service/role-category.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RoleCategory.name, schema: RoleCategorySchema },
    ]),
    AuthModule,
  ],
  controllers: [RoleCategoryController],
  providers: [RoleCategoryService],
  exports: [RoleCategoryService, MongooseModule],
})
export class RoleCategoryModule {}
