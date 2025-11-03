import { Connection, Model } from 'mongoose';
import {
  closeTestDatabase,
  createTestDatabase,
  TestDatabaseInstance,
} from '../../../../test-utils/database.helper';
import { RoleCategoryService } from './role-category.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  getConnectionToken,
  getModelToken,
  MongooseModule,
} from '@nestjs/mongoose';
import {
  RoleCategory,
  RoleCategorySchema,
} from '../model/role-category.schema';
import { RoleCategoryDto } from '../model/role-category.dto';

describe('Role Category Service', () => {
  let service: RoleCategoryService;
  let dbInstance: TestDatabaseInstance;
  let mongoConnection: Connection;
  let roleCategoryModel: Model<RoleCategory>;

  beforeEach(async () => {
    dbInstance = await createTestDatabase();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(dbInstance.uri), // ✅ Direct usage
        MongooseModule.forFeature([
          { name: RoleCategory.name, schema: RoleCategorySchema },
        ]),
      ],
      providers: [RoleCategoryService],
    }).compile();

    service = module.get<RoleCategoryService>(RoleCategoryService);
    mongoConnection = module.get<Connection>(getConnectionToken());
    roleCategoryModel = module.get<Model<RoleCategory>>(
      getModelToken(RoleCategory.name),
    );
  });

  afterAll(async () => {
    if (mongoConnection) {
      await mongoConnection.close();
    }
    await closeTestDatabase(dbInstance);
  });

  it('should save role category', async () => {
    const dto = new RoleCategoryDto('test');
    const result = service.addRoleCategory(dto);

    await result.then((it) => expect(it.name).toEqual('test'));

    const persisted = await roleCategoryModel.find({ name: 'test' });
    expect(persisted.length).toEqual(1);
    expect(persisted[0].name).toEqual('test');
  });

  it('should find all categories', async () => {
    const categoryA = new roleCategoryModel({ name: 'categoryA' });
    const categoryB = new roleCategoryModel({ name: 'categoryB' });

    await roleCategoryModel.bulkSave([categoryA, categoryB]);

    const categoriesFetched = await service.findAll();

    expect(categoriesFetched.length).toEqual(2);
    expect(categoriesFetched.map((it) => it.name)).toEqual(
      expect.arrayContaining(['categoryA', 'categoryB']),
    );
  });
});
