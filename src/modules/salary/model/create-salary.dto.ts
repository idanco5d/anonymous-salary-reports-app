import { BaseSalaryDto } from './base-salary.dto';
import { IsMongoId } from 'class-validator';

export class CreateSalaryDto extends BaseSalaryDto {
  @IsMongoId()
  roleId: string;
}
