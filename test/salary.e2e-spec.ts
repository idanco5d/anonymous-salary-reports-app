import { INestApplication } from '@nestjs/common';
import {
  afterE2eTest,
  cleanupTestData,
  configureE2eTest,
  getAuthenticatedRequest,
  postAuthenticatedRequest,
  TestDatabaseInstance,
} from '../test-utils/database.helper';
import { Connection, Types } from 'mongoose';
import { SalaryModule } from '../src/modules/salary/salary.module';
import { CreateSalaryDto } from '../src/modules/salary/model/create-salary.dto';
import { Education } from '../src/modules/salary/model/education';
import { EmployerType } from '../src/modules/salary/model/employerType';
import { RoleDto } from '../src/modules/role/model/role.dto';
import { Response } from 'supertest';
import { Role } from '../src/modules/role/model/role.schema';
import { Salary } from '../src/modules/salary/model/salary.schema';
import { SalaryDto } from '../src/modules/salary/model/salary.dto';

describe('Salary E2E test', () => {
  let app: INestApplication;
  let dbInstance: TestDatabaseInstance;
  let mongoConnection: Connection;
  let accessToken: string;

  beforeAll(async () => {
    ({ app, dbInstance, mongoConnection, accessToken } =
      await configureE2eTest(SalaryModule));
  });

  afterAll(async () => afterE2eTest(mongoConnection, dbInstance, app));

  afterEach(async () => cleanupTestData(mongoConnection));

  it('should create salary', async () => {
    const { roleId, createSalaryDto, createSalaryResponse } =
      await createRoleAndSalary();

    compareSalaryResponseToSentDto(
      createSalaryResponse,
      roleId,
      createSalaryDto,
    );
  });

  it('should like a salary and then unlike it', async () => {
    const { createSalaryResponse } = await createRoleAndSalary();
    const salaryId = (createSalaryResponse.body as Salary)
      ._id as Types.ObjectId;

    const toggleLikeResponse = await postAuthenticatedRequest(
      app,
      `/salary/toggle-like/salary/${salaryId.toString()}`,
      accessToken,
    );

    const toggleLikeSalaryDto = toggleLikeResponse.body as SalaryDto;
    expect(toggleLikeSalaryDto.likes).toEqual(1);

    const toggleUnlikeResponse = await postAuthenticatedRequest(
      app,
      `/salary/toggle-like/salary/${salaryId.toString()}`,
      accessToken,
    );

    const toggleUnlikeSalaryDto = toggleUnlikeResponse.body as SalaryDto;
    expect(toggleUnlikeSalaryDto.likes).toEqual(0);
  });

  it('should dislike a salary and then un-dislike it', async () => {
    const { createSalaryResponse } = await createRoleAndSalary();
    const salaryId = (createSalaryResponse.body as Salary)
      ._id as Types.ObjectId;

    const toggleDislikeResponse = await postAuthenticatedRequest(
      app,
      `/salary/toggle-dislike/salary/${salaryId.toString()}`,
      accessToken,
    );

    const toggleDislikeSalaryDto = toggleDislikeResponse.body as SalaryDto;
    expect(toggleDislikeSalaryDto.dislikes).toEqual(1);

    const toggleUnDislikeResponse = await postAuthenticatedRequest(
      app,
      `/salary/toggle-dislike/salary/${salaryId.toString()}`,
      accessToken,
    );

    const toggleUnDislikeSalaryDto = toggleUnDislikeResponse.body as SalaryDto;
    expect(toggleUnDislikeSalaryDto.dislikes).toEqual(0);
  });

  it('should get all by role', async () => {
    const { roleId, createSalaryDto, createSalaryResponse, roleDto } =
      await createRoleAndSalary();
    const anotherCreateSalaryDto: CreateSalaryDto = {
      roleId: roleId.toString(),
      baseSalary: 40000,
      extras: 5000,
      education: Education.PHD,
      educationInRelevantField: true,
      employerType: EmployerType.INTERNATIONAL_NONTECH_CORP,
      vacationDays: 24,
      startYear: 2018,
      endYear: 2024,
      experienceYears: 7,
    };
    const anotherCreateSalaryResponse = await postAuthenticatedRequest(
      app,
      '/salary/create',
      accessToken,
      anotherCreateSalaryDto,
    );

    const getAllResponse = await getAuthenticatedRequest(
      app,
      `/salary/get-all-by-role/${roleId.toString()}`,
      accessToken,
      roleDto,
    );

    expect(getAllResponse.body).toHaveLength(2);
    compareSalaryResponseToSentDto(
      createSalaryResponse,
      roleId,
      createSalaryDto,
    );
    compareSalaryResponseToSentDto(
      anotherCreateSalaryResponse,
      roleId,
      anotherCreateSalaryDto,
    );
  });

  async function createRoleAndSalary() {
    const roleDto: RoleDto = {
      name: 'test role',
      roleCategory: { name: 'test category' },
    };
    const addRoleResponse = await postAuthenticatedRequest(
      app,
      '/role',
      accessToken,
      roleDto,
    );
    const roleId = (addRoleResponse.body as Role)._id as Types.ObjectId;
    const createSalaryDto: CreateSalaryDto = {
      roleId: roleId.toString(),
      baseSalary: 30000,
      extras: 2000,
      education: Education.BACHELOR,
      educationInRelevantField: true,
      employerType: EmployerType.INTERNATIONAL_TECH_CORP,
      vacationDays: 20,
      startYear: 2020,
      experienceYears: 10,
    };

    const createSalaryResponse = await postAuthenticatedRequest(
      app,
      '/salary/create',
      accessToken,
      createSalaryDto,
    );
    return { roleId, createSalaryDto, createSalaryResponse, roleDto };
  }

  function compareSalaryResponseToSentDto(
    createSalaryResponse: Response,
    roleId: Types.ObjectId,
    createSalaryDto: CreateSalaryDto,
  ) {
    const createdSalary = createSalaryResponse.body as Salary;
    expect(createdSalary.roleId).toEqual(roleId);
    expect(createdSalary.baseSalary).toEqual(createSalaryDto.baseSalary);
    expect(createdSalary.extras).toEqual(createSalaryDto.extras);
    expect(createdSalary.education).toEqual(createSalaryDto.education);
    expect(createdSalary.educationInRelevantField).toEqual(
      createSalaryDto.educationInRelevantField,
    );
    expect(createdSalary.employerType).toEqual(createSalaryDto.employerType);
    expect(createdSalary.vacationDays).toEqual(createSalaryDto.vacationDays);
    expect(createdSalary.startYear).toEqual(createSalaryDto.startYear);
    expect(createdSalary.experienceYears).toEqual(
      createSalaryDto.experienceYears,
    );
    expect(createdSalary.likedBy).toHaveLength(0);
    expect(createdSalary.dislikedBy).toHaveLength(0);
  }
});
