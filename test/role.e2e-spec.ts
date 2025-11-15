import { Connection } from 'mongoose';
import {
  cleanupTestData,
  closeAndStopDatabase,
  createTestDatabase,
  TestDatabaseInstance,
} from '../test-utils/database.helper';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from '../src/modules/role/role.module';
import request from 'supertest';
import { RoleDto } from '../src/modules/role/model/role.dto';
import { Role } from '../src/modules/role/model/role.schema';

describe('Role E2E test', () => {
  let app: INestApplication;
  let dbInstance: TestDatabaseInstance;
  let mongoConnection: Connection;

  beforeAll(async () => {
    dbInstance = await createTestDatabase();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(dbInstance.uri), RoleModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    mongoConnection = moduleFixture.get<Connection>(getConnectionToken());
  });

  afterAll(async () => {
    await closeAndStopDatabase(mongoConnection, dbInstance);
    await app.close();
  });

  afterEach(async () => cleanupTestData(mongoConnection));

  it('should add a role and get it', async () => {
    const roleDto: RoleDto = {
      name: 'test role',
      roleCategory: { name: 'test category' },
    };
    const addRoleResponse = await request(app.getHttpServer())
      .post('/role')
      .send(roleDto)
      .expect(201);

    const addedRole = addRoleResponse.body as Role;
    expect(addedRole.name).toEqual('test role');
    expect(addedRole.roleCategoryId).toBeDefined();

    const getRoleResponse = await request(app.getHttpServer())
      .get('/role?categoryName=test%20category')
      .expect(200);

    expect((getRoleResponse.body as RoleDto[])[0]).toEqual(roleDto);
  });
});
