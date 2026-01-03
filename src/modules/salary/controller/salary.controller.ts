import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SalaryService } from '../service/salary.service';
import { CreateSalaryDto } from '../model/create-salary.dto';
import { Salary } from '../model/salary.schema';
import { SalaryDto } from '../model/salary.dto';
import { CurrentUserId } from '../../../auth/decorators/current-user-id.decorator';

@Controller('salary')
export class SalaryController {
  constructor(private salaryService: SalaryService) {}

  @Post('/create')
  async create(
    @Body() createSalaryDto: CreateSalaryDto,
    @CurrentUserId() userId: string,
  ): Promise<Salary> {
    return this.salaryService.create(createSalaryDto, userId);
  }

  @Get('/get-all-by-role/:roleId')
  async getAllByRole(
    @Param('roleId') roleId: string,
    @CurrentUserId() userId: string,
  ): Promise<SalaryDto[]> {
    return this.salaryService.getAllByRoleId(roleId, userId);
  }

  @Post('/toggle-like/salary/:salaryId')
  async toggleLike(
    @Param('salaryId') salaryId: string,
    @CurrentUserId() userId: string,
  ): Promise<SalaryDto> {
    return this.salaryService.toggleLike(salaryId, userId);
  }

  @Post('/toggle-dislike/salary/:salaryId')
  async toggleDislike(
    @Param('salaryId') salaryId: string,
    @CurrentUserId() userId: string,
  ): Promise<SalaryDto> {
    return this.salaryService.toggleDislike(salaryId, userId);
  }
}
