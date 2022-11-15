import supertest from 'supertest';
import Client from '../../database';
import app from '../../server';

const req = supertest(app);

describe('test Product routes', (): void => {
  let token = '';
  beforeAll(async (): Promise<void> => {
    // create a user
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
  });

  it('1- test creating a product', async (): Promise<void> => {
    const res = await req
      .post(`/products`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'shoes',
        price: 300,
      });

    expect(res.body).toEqual({
      id: 1,
      name: 'shoes',
      price: 300,
    });
  });

  it('2- test showing all products', async (): Promise<void> => {
    const res = await req.get(`/products`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        id: 1,
        name: 'shoes',
        price: 300,
      },
    ]);
  });

  it('3- test showing product with id = 1', async (): Promise<void> => {
    const res = await req.get(`/products/1`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 1,
      name: 'shoes',
      price: 300,
    });
  });

  it('4- test deleting a product with id = 1', async (): Promise<void> => {
    const res = await req
      .delete(`/products`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: '1',
      });
    expect(res.body).toEqual({
      id: 1,
      name: 'shoes',
      price: 300,
    });
  });

  afterAll(async (): Promise<void> => {
    const conn = await Client.connect();
    const sql =
      'DELETE FROM products;\nALTER SEQUENCE products_id_seq RESTART WITH 1;\nDELETE From users;\nALTER SEQUENCE users_id_seq RESTART WITH 1;';
    await conn.query(sql);
    conn.release();
  });
});
