import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SalaryService } from '../service/salary.service';
import { CreateSalaryDto } from '../model/create-salary.dto';
import { Salary } from '../model/salary.schema';
import { SalaryDto } from '../model/salary.dto';

@Controller('salary')
export class SalaryController {
  constructor(private salaryService: SalaryService) {}

  @Post('/create')
  async create(@Body() createSalaryDto: CreateSalaryDto): Promise<Salary> {
    return this.salaryService.create(createSalaryDto);
  }

  @Get('/get-all-by-role/:roleId')
  async getAllByRole(@Param('roleId') roleId: string): Promise<SalaryDto[]> {
    return this.salaryService.getAllByRoleId(roleId);
  }

  @Post('/toggle-like/salary/:salaryId/user/:userId')
  async toggleLike(
    @Param('salaryId') salaryId: string,
    @Param('userId') userId: string,
  ): Promise<SalaryDto> {
    return this.salaryService.toggleLike(salaryId, userId);
  }

  @Post('/toggle-dislike/salary/:salaryId/user/:userId')
  async toggleDislike(
    @Param('salaryId') salaryId: string,
    @Param('userId') userId: string,
  ): Promise<SalaryDto> {
    return this.salaryService.toggleDislike(salaryId, userId);
  }
}
