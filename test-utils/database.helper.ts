// test-utils/database.helper.ts
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoDb: MongoMemoryServer | null = null;

export interface TestDatabaseInstance {
  mongoDb: MongoMemoryServer;
  uri: string;
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
