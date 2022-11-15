import supertest from 'supertest';
import Client from '../../database';
import app from '../../server';

const req = supertest(app);
describe('test user routes', (): void => {
  let token = '';
  it('1- test creating a user', async (): Promise<void> => {
    const res = await req
      .post('/users')
      .set('Content-Type', 'application/json')
      .send({
        firstname: 'test',
        lastname: 'user',
        email: 'user@test.com',
        password: '123456',
      });
    token = res.body.token;
    expect(res.body.newUser.id).toEqual(1);
    expect(res.body.newUser.email).toEqual('user@test.com');
  });

  it('2- test showing all users', async (): Promise<void> => {
    const res = await req.get('/users').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].id).toEqual(1);
    expect(res.body[0].email).toEqual('user@test.com');
    expect(res.body[0].firstname).toEqual('test');
  });

  it('3- test showing a user with id = 1', async (): Promise<void> => {
    const res = await req
      .get('/users/1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toEqual(1);
    expect(res.body.email).toEqual('user@test.com');
    expect(res.body.firstname).toEqual('test');
  });

  it('4- Expect to return a user after successful authentication', async (): Promise<void> => {
    const res = await req
      .post('/users/authenticate')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'user@test.com',
        password: '123456',
      });

    token = res.body.token;
    expect(res.body.authenticatdUser.id).toEqual(1);
    expect(res.body.authenticatdUser.email).toEqual('user@test.com');
  });

  it('5- Expect to return a null after failed authentication', async (): Promise<void> => {
    const res = await req
      .post('/users/authenticate')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'user@test.com',
        password: 'wad652',
      });

    expect(res.body.authenticatdUser).toBeNull();
  });

  afterAll(async (): Promise<void> => {
    const conn = await Client.connect();
    const sql =
      'DELETE From users;\nALTER SEQUENCE users_id_seq RESTART WITH 1;';
    await conn.query(sql);
    conn.release();
  });
});
