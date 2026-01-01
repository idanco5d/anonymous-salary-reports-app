import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Salary, SalarySchema } from './model/salary.schema';
import { RoleModule } from '../role/role.module';
import { SalaryController } from './controller/salary.controller';
import { SalaryService } from './service/salary.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Salary.name, schema: SalarySchema }]),
    RoleModule,
  ],
  controllers: [SalaryController],
  providers: [SalaryService],
})
export class SalaryModule {}
