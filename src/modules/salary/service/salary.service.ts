import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Salary } from '../model/salary.schema';
import { Model, Types } from 'mongoose';
import { SalaryDto } from '../model/salary.dto';
import { RoleService } from '../../role/service/role.service';
import { CreateSalaryDto } from '../model/create-salary.dto';

@Injectable()
export class SalaryService {
  constructor(
    private roleService: RoleService,

    @InjectModel(Salary.name)
    private salaryModel: Model<Salary>,
  ) {}

  async create(createSalaryDto: CreateSalaryDto): Promise<Salary> {
    return await new this.salaryModel({
      baseSalary: createSalaryDto.baseSalary,
      extras: createSalaryDto.extras,
      roleId: createSalaryDto.roleId,
      experienceYears: createSalaryDto.experienceYears,
      education: createSalaryDto.education,
      educationInRelevantField: createSalaryDto.educationInRelevantField,
      vacationDays: createSalaryDto.vacationDays,
      employerType: createSalaryDto.employerType,
      likedBy: [],
      dislikedBy: [],
      startYear: createSalaryDto.startYear,
      endYear: createSalaryDto.endYear,
      createdBy: 'SYSTEM', //TODO switch to current user when auth service is implemented
      lastUpdatedBy: 'SYSTEM',
    }).save();
  }

  async getAllByRoleId(roleId: string): Promise<SalaryDto[]> {
    const roleDto = await this.roleService.findDtoById(roleId);
    const salaries = await this.salaryModel.find({ roleId });
    if (salaries.length === 0) {
      throw new NotFoundException('No salaries found');
    }

    return salaries.map((salary) => ({
      id: (salary._id as Types.ObjectId).toString(),
      baseSalary: salary.baseSalary,
      extras: salary.extras,
      roleDto: roleDto,
      experienceYears: salary.experienceYears,
      education: salary.education,
      educationInRelevantField: salary.educationInRelevantField,
      vacationDays: salary.vacationDays,
      employerType: salary.employerType,
      likes: salary.likedBy.length,
      dislikes: salary.dislikedBy.length,
      isLikedByCurrentUser: false, // TODO change when auth is implemented
      isDislikedByCurrentUser: false,
      startYear: salary.startYear,
      endYear: salary.endYear,
    }));
  }

  async toggleLike(salaryId: string, userId: string) {
    const salary = await this.salaryModel.findById(salaryId);
    if (!salary) {
      throw new NotFoundException('Salary not found');
    }

    const userObjectId = new Types.ObjectId(userId);
    const hasLiked = salary.likedBy.some((id) => id.equals(userObjectId));

    if (hasLiked) {
      salary.likedBy = salary.likedBy.filter((id) => id.toString() !== userId);
    } else {
      salary.likedBy.push(userObjectId);
      salary.dislikedBy = salary.dislikedBy.filter(
        (id) => id.toString() !== userId,
      );
    }
    salary.lastUpdatedBy = 'SYSTEM'; // TODO change when auth is implemented

    return await this.saveSalaryAndGetSalaryDto(salary);
  }

  async toggleDislike(salaryId: string, userId: string) {
    const salary = await this.salaryModel.findById(salaryId);
    if (!salary) {
      throw new NotFoundException('Salary not found');
    }

    const userObjectId = new Types.ObjectId(userId);
    const hasDisliked = salary.dislikedBy.some((id) => id.equals(userObjectId));

    if (hasDisliked) {
      salary.dislikedBy = salary.dislikedBy.filter(
        (id) => id.toString() !== userId,
      );
    } else {
      salary.dislikedBy.push(userObjectId);
      salary.likedBy = salary.likedBy.filter((id) => id.toString() !== userId);
    }
    salary.lastUpdatedBy = 'SYSTEM'; // TODO change when auth is implemented

    return await this.saveSalaryAndGetSalaryDto(salary);
  }

  private async saveSalaryAndGetSalaryDto(salary: Salary): Promise<SalaryDto> {
    await salary.save();
    const roleDto = await this.roleService.findDtoById(
      salary.roleId.toString(),
    );

    return new SalaryDto(
      salary,
      false, // TODO change when auth is implemented
      false,
      roleDto,
    );
  }
}
