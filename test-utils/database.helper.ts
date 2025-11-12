// test-utils/database.helper.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import {
  getConnectionToken,
  getModelToken,
  ModelDefinition,
  MongooseModule,
} from '@nestjs/mongoose';
import { Type } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';

let mongoDb: MongoMemoryServer | null = null;

export interface TestDatabaseInstance {
  mongoDb: MongoMemoryServer;
  uri: string;
}

export interface TestConfig<T, V> {
  service: T;
  dbInstance: TestDatabaseInstance;
  mongoConnection: Connection;
  model: Model<V>;
  module: TestingModule;
}

export async function configureTest<T, V>(
  models: ModelDefinition[],
  serviceClass: Type<T>,
  model: string,
): Promise<TestConfig<T, V>> {
  const dbInstance = await createTestDatabase();

  const module: TestingModule = await Test.createTestingModule({
    imports: [
      MongooseModule.forRoot(dbInstance.uri),
      MongooseModule.forFeature(models),
    ],
    providers: [serviceClass],
  }).compile();

  return {
    service: module.get<T>(serviceClass),
    dbInstance,
    mongoConnection: module.get<Connection>(getConnectionToken()),
    model: module.get<Model<V>>(getModelToken(model)),
    module,
  };
}

export async function cleanUpTest(
  mongoConnection: Connection,
  dbInstance: TestDatabaseInstance,
) {
  if (mongoConnection) {
    await mongoConnection.close();
  }
  await closeTestDatabase(dbInstance);
}

export async function createTestDatabase(): Promise<TestDatabaseInstance> {
  mongoDb = await MongoMemoryServer.create();
  const uri = mongoDb.getUri();

  return {
    mongoDb: mongoDb,
    uri,
  };
}

export async function closeTestDatabase(
  instance: TestDatabaseInstance,
): Promise<void> {
  if (instance.mongoDb) {
    await instance.mongoDb.stop();
  }
  mongoDb = null;
}
