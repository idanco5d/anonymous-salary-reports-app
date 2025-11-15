import { RoleService } from './role.service';
import {
  cleanupTestData,
  closeAndStopDatabase,
  configureTest,
  TestConfig,
  TestDatabaseInstance,
} from '../../../../test-utils/database.helper';
import { Connection, Model } from 'mongoose';
import { Role, RoleSchema } from '../model/role.schema';
import { RoleDto } from '../model/role.dto';
import { RoleCategoryDto } from '../../role-category/model/role-category.dto';
import {
  RoleCategory,
  RoleCategorySchema,
} from '../../role-category/model/role-category.schema';
import { getModelToken } from '@nestjs/mongoose';
import { RoleCategoryModule } from '../../role-category/role-category.module';

describe('Role Service', () => {
  let service: RoleService;
  let dbInstance: TestDatabaseInstance;
  let mongoConnection: Connection;
  let roleModel: Model<Role>;
  let roleCategoryModel: Model<RoleCategory>;

  beforeAll(async () => {
    const testConfig: TestConfig<RoleService, Role> = await configureTest(
      [
        { name: Role.name, schema: RoleSchema },
        { name: RoleCategory.name, schema: RoleCategorySchema },
      ],
      RoleService,
      Role.name,
      [RoleCategoryModule],
    );

    service = testConfig.service;
    dbInstance = testConfig.dbInstance;
    mongoConnection = testConfig.mongoConnection;
    roleModel = testConfig.model;
    roleCategoryModel = testConfig.module.get<Model<RoleCategory>>(
      getModelToken(RoleCategory.name),
    );
  });

  beforeEach(async () => cleanupTestData(mongoConnection));

  afterAll(async () => closeAndStopDatabase(mongoConnection, dbInstance));

  it('should save role', async () => {
    const dto = new RoleDto('test role', new RoleCategoryDto('test category'));
    const result = await service.addRole(dto);

    expect(result.name).toEqual('test role');
    expect(result.roleCategoryId).toBeDefined();

    const persisted = await roleModel.find();
    expect(persisted.length).toEqual(1);
    expect(persisted[0].name).toEqual('test role');
  });

  it('should get all by category name', async () => {
    const category = new roleCategoryModel({
      name: 'category',
      createdBy: 'SYSTEM',
      lastUpdatedBy: 'SYSTEM',
    });

    await roleCategoryModel.bulkSave([category]);
    const persistedCategory = await roleCategoryModel.find();

    const roleA = new roleModel({
      name: 'roleA',
      roleCategoryId: persistedCategory[0]._id,
      createdBy: 'SYSTEM',
      lastUpdatedBy: 'SYSTEM',
    });
    const roleB = new roleModel({
      name: 'roleB',
      roleCategoryId: persistedCategory[0]._id,
      createdBy: 'SYSTEM',
      lastUpdatedBy: 'SYSTEM',
    });

    await roleModel.bulkSave([roleA, roleB]);

    const rolesFetched = await service.getAllByCategoryName(category.name);
    expect(rolesFetched.length).toEqual(2);
    // expect(rolesFetched).toContainEqual(roleA.toDto());
    // expect(rolesFetched).toContainEqual(roleB.toDto());
  });
});
