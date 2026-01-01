import {
  cleanupTestData,
  closeAndStopDatabase,
  configureTest,
  TestConfig,
  TestDatabaseInstance,
} from '../../../../test-utils/database.helper';
import { Connection, Model, Types } from 'mongoose';
import { Salary, SalarySchema } from '../model/salary.schema';
import { RoleModule } from '../../role/role.module';
import { SalaryService } from './salary.service';
import { CreateSalaryDto } from '../model/create-salary.dto';
import { Role } from '../../role/model/role.schema';
import { getModelToken } from '@nestjs/mongoose';
import { RoleCategory } from '../../role-category/model/role-category.schema';
import { Education } from '../model/education';
import { EmployerType } from '../model/employerType';
import { SalaryDto } from '../model/salary.dto';
import { RoleDto } from '../../role/model/role.dto';
import { RoleCategoryDto } from '../../role-category/model/role-category.dto';

describe('Salary Service', () => {
  let service: SalaryService;
  let dbInstance: TestDatabaseInstance;
  let mongoConnection: Connection;
  let salaryModel: Model<Salary>;
  let roleModel: Model<Role>;
  let roleCategoryModel: Model<RoleCategory>;

  beforeAll(async () => {
    const testConfig: TestConfig<SalaryService, Salary> = await configureTest(
      [{ name: Salary.name, schema: SalarySchema }],
      SalaryService,
      Salary.name,
      [RoleModule],
    );

    service = testConfig.service;
    dbInstance = testConfig.dbInstance;
    mongoConnection = testConfig.mongoConnection;
    salaryModel = testConfig.model;
    roleModel = testConfig.module.get<Model<Role>>(getModelToken(Role.name));
    roleCategoryModel = testConfig.module.get<Model<RoleCategory>>(
      getModelToken(RoleCategory.name),
    );
  });

  beforeEach(async () => cleanupTestData(mongoConnection));

  afterAll(async () => closeAndStopDatabase(mongoConnection, dbInstance));

  async function createCategoryAndRole() {
    const roleCategory = await new roleCategoryModel({
      name: 'category name',
      lastUpdatedBy: 'SYSTEM',
      createdBy: 'SYSTEM',
    }).save();

    const role = await new roleModel({
      name: 'role name',
      roleCategoryId: roleCategory._id,
      lastUpdatedBy: 'SYSTEM',
      createdBy: 'SYSTEM',
    }).save();

    return { role, roleCategory };
  }

  it('should create salary', async () => {
    const { role } = await createCategoryAndRole();

    const dto: CreateSalaryDto = {
      roleId: (role._id as Types.ObjectId).toString(),
      baseSalary: 30000,
      extras: 2000,
      education: Education.BACHELOR,
      educationInRelevantField: true,
      employerType: EmployerType.INTERNATIONAL_TECH_CORP,
      vacationDays: 20,
      startYear: 2020,
      experienceYears: 10,
    };

    const addResponse = await service.create(dto);
    const allPersistedSalaries = await salaryModel.find();
    expect(allPersistedSalaries.length).toEqual(1);
    const persistedSalary = allPersistedSalaries[0];

    Object.keys(dto).forEach((key) => {
      expect(addResponse[key]).toEqual(dto[key]);
      expect(persistedSalary[key]).toEqual(dto[key]);
    });
  });

  it('should get all by role', async () => {
    const { role, roleCategory } = await createCategoryAndRole();
    const roleId = (role._id as Types.ObjectId).toString();
    const salaryA = await new salaryModel({
      roleId,
      baseSalary: 30000,
      extras: 2000,
      education: Education.BACHELOR,
      educationInRelevantField: true,
      employerType: EmployerType.INTERNATIONAL_TECH_CORP,
      vacationDays: 20,
      startYear: 2020,
      experienceYears: 10,
      createdBy: 'SYSTEM',
      lastUpdatedBy: 'SYSTEM',
    }).save();
    const salaryB = await new salaryModel({
      roleId,
      baseSalary: 20000,
      extras: 1000,
      education: Education.MASTER,
      educationInRelevantField: false,
      employerType: EmployerType.DEFENSE_CORP,
      vacationDays: 18,
      startYear: 2021,
      experienceYears: 5,
      createdBy: 'SYSTEM',
      lastUpdatedBy: 'SYSTEM',
    }).save();

    const result = await service.getAllByRoleId(roleId);

    expect(result.length).toEqual(2);
    result.forEach((foundSalary) => {
      const matchingSalaryDoc = [salaryA, salaryB].find(
        (it) => it._id == foundSalary.id,
      )!;

      expect(foundSalary).toEqual(
        new SalaryDto(
          matchingSalaryDoc,
          false,
          false,
          new RoleDto(role, new RoleCategoryDto(roleCategory)),
        ),
      );
    });
  });

  it('should like a salary and then remove like', async () => {
    const { role } = await createCategoryAndRole();
    const roleId = (role._id as Types.ObjectId).toString();
    const salary = await new salaryModel({
      roleId,
      baseSalary: 30000,
      extras: 2000,
      education: Education.BACHELOR,
      educationInRelevantField: true,
      employerType: EmployerType.INTERNATIONAL_TECH_CORP,
      vacationDays: 20,
      startYear: 2020,
      experienceYears: 10,
      createdBy: 'SYSTEM',
      lastUpdatedBy: 'SYSTEM',
    }).save();

    const userId = roleId; // TODO change to actual userId when auth service implemented
    await service.toggleLike((salary._id as Types.ObjectId).toString(), userId);

    const likedSalary = await salaryModel.find();
    expect(likedSalary).toHaveLength(1);
    expect(likedSalary[0].likedBy).toHaveLength(1);
    expect(likedSalary[0].likedBy[0].toString()).toEqual(userId);

    await service.toggleLike((salary._id as Types.ObjectId).toString(), userId);

    const unlikedSalary = await salaryModel.find();
    expect(unlikedSalary).toHaveLength(1);
    expect(unlikedSalary[0].likedBy).toHaveLength(0);
  });

  it('should dislike a salary and then remove dislike', async () => {
    const { role } = await createCategoryAndRole();
    const roleId = (role._id as Types.ObjectId).toString();
    const salary = await new salaryModel({
      roleId,
      baseSalary: 30000,
      extras: 2000,
      education: Education.BACHELOR,
      educationInRelevantField: true,
      employerType: EmployerType.INTERNATIONAL_TECH_CORP,
      vacationDays: 20,
      startYear: 2020,
      experienceYears: 10,
      createdBy: 'SYSTEM',
      lastUpdatedBy: 'SYSTEM',
    }).save();

    const userId = roleId;
    await service.toggleDislike(
      (salary._id as Types.ObjectId).toString(),
      userId,
    );

    const dislikedSalary = await salaryModel.find();
    expect(dislikedSalary).toHaveLength(1);
    expect(dislikedSalary[0].dislikedBy).toHaveLength(1);
    expect(dislikedSalary[0].dislikedBy[0].toString()).toEqual(userId);

    await service.toggleDislike(
      (salary._id as Types.ObjectId).toString(),
      userId,
    );

    const unlikedSalary = await salaryModel.find();
    expect(unlikedSalary).toHaveLength(1);
    expect(unlikedSalary[0].dislikedBy).toHaveLength(0);
  });
});
