import { INestApplication } from '@nestjs/common';
import {
  afterE2eTest,
  cleanupTestData,
  configureE2eTest,
  getAuthenticatedRequest,
  postAuthenticatedRequest,
  TestDatabaseInstance,
} from '../test-utils/database.helper';
import { Connection } from 'mongoose';
import { RoleCategoryModule } from '../src/modules/role-category/role-category.module';
import { RoleCategoryDto } from '../src/modules/role-category/model/role-category.dto';

describe('Role Category E2E test', () => {
  let app: INestApplication;
  let dbInstance: TestDatabaseInstance;
  let mongoConnection: Connection;
  let accessToken: string;

  beforeAll(async () => {
    ({ app, dbInstance, mongoConnection, accessToken } =
      await configureE2eTest(RoleCategoryModule));
  });

  afterAll(async () => afterE2eTest(mongoConnection, dbInstance, app));

  afterEach(async () => cleanupTestData(mongoConnection));

  it('should add a role category', async () => {
    const dto: RoleCategoryDto = { name: 'test' };

    const response = await postAuthenticatedRequest(
      app,
      '/role-category',
      accessToken,
      dto,
    );

    expect((response.body as RoleCategoryDto).name).toEqual('test');
  });

  it('should find all categories', async () => {
    const dto1: RoleCategoryDto = { name: 'test1' };
    const dto2: RoleCategoryDto = { name: 'test2' };

    for (const dto of [dto1, dto2]) {
      await postAuthenticatedRequest(app, '/role-category', accessToken, dto);
    }

    const response = await getAuthenticatedRequest(
      app,
      '/role-category',
      accessToken,
    );

    const responseDtoList = response.body as RoleCategoryDto[];
    expect(responseDtoList).toHaveLength(2);
    expect(responseDtoList.map((it) => it.name)).toEqual(['test1', 'test2']);
  });
});
