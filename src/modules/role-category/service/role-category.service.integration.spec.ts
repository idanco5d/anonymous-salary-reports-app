import { Connection, Model } from 'mongoose';
import {
  cleanupTestData,
  closeAndStopDatabase,
  configureTest,
  TestConfig,
  TestDatabaseInstance,
} from '../../../../test-utils/database.helper';
import { RoleCategoryService } from './role-category.service';
import {
  RoleCategory,
  RoleCategorySchema,
} from '../model/role-category.schema';
import { RoleCategoryDto } from '../model/role-category.dto';
import { NotFoundException } from '@nestjs/common';

describe('Role Category Service', () => {
  let service: RoleCategoryService;
  let dbInstance: TestDatabaseInstance;
  let mongoConnection: Connection;
  let roleCategoryModel: Model<RoleCategory>;

  beforeAll(async () => {
    const testConfig: TestConfig<RoleCategoryService, RoleCategory> =
      await configureTest(
        [{ name: RoleCategory.name, schema: RoleCategorySchema }],
        RoleCategoryService,
        RoleCategory.name,
      );

    service = testConfig.service;
    dbInstance = testConfig.dbInstance;
    mongoConnection = testConfig.mongoConnection;
    roleCategoryModel = testConfig.model;
  });

  beforeEach(async () => cleanupTestData(mongoConnection));

  afterAll(async () => closeAndStopDatabase(mongoConnection, dbInstance));

  it('should create role category', async () => {
    const dto: RoleCategoryDto = { name: 'test' };
    const userId = 'TEST_USER';
    const result = await service.create(dto, userId);

    expect(result.name).toEqual('test');

    const persisted = await service.findByName(result.name);
    expect(persisted.name).toEqual('test');
    expect(persisted.createdBy).toEqual(userId);
    expect(persisted.lastUpdatedBy).toEqual(userId);
  });

  it('should find all categories', async () => {
    const categoryA = new roleCategoryModel({
      name: 'categoryA',
      createdBy: 'SYSTEM',
      lastUpdatedBy: 'SYSTEM',
    });
    const categoryB = new roleCategoryModel({
      name: 'categoryB',
      createdBy: 'SYSTEM',
      lastUpdatedBy: 'SYSTEM',
    });

    await roleCategoryModel.bulkSave([categoryA, categoryB]);

    const categoriesFetched = await service.findAll();

    expect(categoriesFetched.length).toEqual(2);
    expect(categoriesFetched.map((it) => it.name)).toEqual(
      expect.arrayContaining(['categoryA', 'categoryB']),
    );
  });

  it('should throw not found exception when no such category', async () => {
    const dto: RoleCategoryDto = { name: 'test' };
    await service.create(dto, 'TEST_USER');

    await expect(service.findByName('nonexistent')).rejects.toThrow(
      NotFoundException,
    );
  });
});
