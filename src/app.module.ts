import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoleCategoryModule } from './modules/role-category/role-category.module';
import { RoleModule } from './modules/role/role.module';

@Module({
  imports: [RoleCategoryModule, RoleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
