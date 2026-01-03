// test-utils/database.helper.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import {
  getConnectionToken,
  getModelToken,
  ModelDefinition,
  MongooseModule,
} from '@nestjs/mongoose';
import { INestApplication, Type } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';

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
  additionalImports: Type[] = [],
): Promise<TestConfig<T, V>> {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
  const dbInstance = await createTestDatabase();

  const module: TestingModule = await Test.createTestingModule({
    imports: [
      MongooseModule.forRoot(dbInstance.uri),
      MongooseModule.forFeature(models),
      ...additionalImports,
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

export async function configureE2eTest<T>(moduleClass: Type<T>) {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
  const dbInstance = await createTestDatabase();

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [MongooseModule.forRoot(dbInstance.uri), moduleClass],
    providers: [
      {
        provide: APP_GUARD,
        useClass: JwtAuthGuard,
      },
    ],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  const mongoConnection = moduleFixture.get<Connection>(getConnectionToken());
  const jwtService = moduleFixture.get<JwtService>(JwtService);
  const configService = moduleFixture.get<ConfigService>(ConfigService);
  const accessToken = jwtService.sign(
    { userId: '695939e556ed7d7e021f5f8b' },
    { secret: configService.get<string>('JWT_ACCESS_SECRET'), expiresIn: '2m' },
  );

  return { app, dbInstance, mongoConnection, accessToken };
}

export async function afterE2eTest(
  mongoConnection: Connection,
  dbInstance: TestDatabaseInstance,
  app: INestApplication,
): Promise<void> {
  await closeAndStopDatabase(mongoConnection, dbInstance);
  await app.close();
}

export async function closeAndStopDatabase(
  mongoConnection: Connection,
  dbInstance: TestDatabaseInstance,
) {
  if (mongoConnection) {
    await mongoConnection.close();
  }
  await closeTestDatabase(dbInstance);
}

export async function cleanupTestData(mongoConnection: Connection) {
  for (const key in mongoConnection.collections) {
    await mongoConnection.collections[key].deleteMany({});
  }
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

export async function postAuthenticatedRequest<
  T extends string | object | undefined,
>(app: INestApplication, url: string, accessToken: string, body?: T) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return await request(app.getHttpServer())
    .post(url)
    .set('Authorization', `Bearer ${accessToken}`)
    .send(body)
    .expect(201);
}

export async function getAuthenticatedRequest<
  T extends string | object | undefined,
>(app: INestApplication, url: string, accessToken: string, body?: T) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return await request(app.getHttpServer())
    .get(url)
    .set('Authorization', `Bearer ${accessToken}`)
    .send(body)
    .expect(200);
}
