import { Max, Min } from 'class-validator';
import { Education } from './education';
import { EmployerType } from './employerType';

export class BaseSalaryDto {
  @Min(0, { message: 'Salary cannot be negative' })
  baseSalary: number;

  @Min(0, { message: 'Extras cannot be negative' })
  extras: number;

  @Min(0, { message: 'Experience cannot be negative' })
  experienceYears: number;

  education: Education;

  educationInRelevantField: boolean;

  employerType: EmployerType;

  @Min(12, { message: 'Minimum vacation days in Israel are 12' })
  vacationDays?: number;

  @Min(1940, { message: 'Start year cannot be too far in the past' })
  @Max(new Date().getFullYear(), { message: 'Year cannot be in the future' })
  startYear?: number;

  @Min(1940, { message: 'End year cannot be too far in the past' })
  @Max(new Date().getFullYear(), { message: 'Year cannot be in the future' })
  endYear?: number;
}
