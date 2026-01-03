import { Connection } from 'mongoose';
import {
  afterE2eTest,
  cleanupTestData,
  configureE2eTest,
  getAuthenticatedRequest,
  postAuthenticatedRequest,
  TestDatabaseInstance,
} from '../test-utils/database.helper';
import { INestApplication } from '@nestjs/common';
import { RoleModule } from '../src/modules/role/role.module';
import { RoleDto } from '../src/modules/role/model/role.dto';
import { Role } from '../src/modules/role/model/role.schema';

describe('Role E2E test', () => {
  let app: INestApplication;
  let dbInstance: TestDatabaseInstance;
  let mongoConnection: Connection;
  let accessToken: string;

  beforeAll(async () => {
    ({ app, dbInstance, mongoConnection, accessToken } =
      await configureE2eTest(RoleModule));
  });

  afterAll(async () => afterE2eTest(mongoConnection, dbInstance, app));

  afterEach(async () => cleanupTestData(mongoConnection));

  it('should add a role and get it', async () => {
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

    const addedRole = addRoleResponse.body as Role;
    const roleCategoryId = addedRole.roleCategoryId;
    expect(addedRole.name).toEqual('test role');
    expect(roleCategoryId).toBeDefined();

    const getRoleResponse = await getAuthenticatedRequest(
      app,
      `/role/category/${roleCategoryId.toString()}`,
      accessToken,
    );

    expect((getRoleResponse.body as RoleDto[])[0]).toEqual(
      new RoleDto(addedRole, {
        id: roleCategoryId.toString(),
        name: 'test category',
      }),
    );
  });
});
