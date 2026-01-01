import { RoleDto } from '../../role/model/role.dto';
import { BaseSalaryDto } from './base-salary.dto';
import { IsMongoId, Min } from 'class-validator';
import { Salary } from './salary.schema';
import { Types } from 'mongoose';

export class SalaryDto extends BaseSalaryDto {
  @IsMongoId()
  id: string;

  roleDto: RoleDto;

  @Min(0, { message: 'Likes cannot be negative' })
  likes: number;

  @Min(0, { message: 'Dislikes cannot be negative' })
  dislikes: number;

  isLikedByCurrentUser: boolean;

  isDislikedByCurrentUser: boolean;

  constructor(
    salary: Salary,
    isLikedByCurrentUser: boolean,
    isDislikedByCurrentUser: boolean,
    roleDto: RoleDto,
  ) {
    super();
    this.id = (salary._id as Types.ObjectId).toString();
    this.baseSalary = salary.baseSalary;
    this.extras = salary.extras;
    this.experienceYears = salary.experienceYears;
    this.education = salary.education;
    this.educationInRelevantField = salary.educationInRelevantField;
    this.vacationDays = salary.vacationDays;
    this.employerType = salary.employerType;
    this.likes = salary.likedBy.length;
    this.dislikes = salary.dislikedBy.length;
    this.isLikedByCurrentUser = isLikedByCurrentUser;
    this.isDislikedByCurrentUser = isDislikedByCurrentUser;
    this.startYear = salary.startYear;
    this.endYear = salary.endYear;
    this.roleDto = roleDto;
  }
}
