import supertest from 'supertest';
import app from '../server';

const req = supertest(app);

describe('test server running', (): void => {
  it('1- test server status to be 200', async (): Promise<void> => {
    const res = await req.get('/');
    expect(res.status).toBe(200);
  });
});
