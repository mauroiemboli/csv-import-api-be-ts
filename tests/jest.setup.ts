// jest.setup.ts
import { dataSource } from '../src/config/database';

beforeAll(async () => {
    await dataSource.connect();
});

afterAll(async () => {
    await dataSource.close();
});