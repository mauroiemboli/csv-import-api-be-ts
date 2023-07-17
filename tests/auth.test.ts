import request from 'supertest';
import { app } from '../src/server';

let authToken: string;

describe('User Authentication', () => {
  it('should login the user', async () => {
    const response = await request(app)
      .post('/api/authorization/login')
      .send({
        email: 'test@midigital.it',
        password: 'midigital@23!'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('authToken');

    authToken = response.body.data.authToken; // store the token
  });
});

describe('User Creation', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${authToken}`) // use the token
      .send({
        firstName: 'Test',
        lastName: 'midigital',
        email: 'test.midigital@example.com',
        password: 'password123!ABC',
        username: "test"
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('user');

  });
});

describe('Product Retrieval', () => {
  it('should retrieve products', async () => {
    const response = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${authToken}`); // use the token

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('message');

  });
});