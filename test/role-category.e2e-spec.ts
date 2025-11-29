import { INestApplication } from '@nestjs/common';
import {
  afterE2eTest,
  cleanupTestData,
  configureE2eTest,
  TestDatabaseInstance,
} from '../test-utils/database.helper';
import { Connection } from 'mongoose';
import { RoleCategoryModule } from '../src/modules/role-category/role-category.module';
import { RoleCategoryDto } from '../src/modules/role-category/model/role-category.dto';
import request from 'supertest';

/* eslint-disable @typescript-eslint/no-unsafe-argument */
describe('Role Category E2E test', () => {
  let app: INestApplication;
  let dbInstance: TestDatabaseInstance;
  let mongoConnection: Connection;

  beforeAll(async () => {
    ({ app, dbInstance, mongoConnection } =
      await configureE2eTest(RoleCategoryModule));
  });

  afterAll(async () => afterE2eTest(mongoConnection, dbInstance, app));

  afterEach(async () => cleanupTestData(mongoConnection));

  it('should add a role category', async () => {
    const dto: RoleCategoryDto = { name: 'test' };

    const response = await request(app.getHttpServer())
      .post('/role-category')
      .send(dto)
      .expect(201);

    expect((response.body as RoleCategoryDto).name).toEqual('test');
  });

  it('should find all categories', async () => {
    const dto1: RoleCategoryDto = { name: 'test1' };
    const dto2: RoleCategoryDto = { name: 'test2' };

    for (const dto of [dto1, dto2]) {
      await request(app.getHttpServer())
        .post('/role-category')
        .send(dto)
        .expect(201);
    }

    const response = await request(app.getHttpServer())
      .get('/role-category')
      .expect(200);

    const responseDtoList = response.body as RoleCategoryDto[];
    expect(responseDtoList).toHaveLength(2);
    expect(responseDtoList.map((it) => it.name)).toEqual(['test1', 'test2']);
  });
});
