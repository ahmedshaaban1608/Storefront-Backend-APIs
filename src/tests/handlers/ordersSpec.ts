import supertest from 'supertest';
import Client from '../../database';
import app from '../../server';

const req = supertest(app);

describe('test Order routes', (): void => {
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
    // create a product
    await req.post(`/products`).set('Authorization', `Bearer ${token}`).send({
      name: 'shoes',
      price: 300,
    });

    // create order with status = active
    await req.post(`/order`).set('Authorization', `Bearer ${token}`).send({
      status: 'active',
      user_id: 1,
    });

    // create order with status = complete
    await req.post(`/order`).set('Authorization', `Bearer ${token}`).send({
      status: 'complete',
      user_id: 1,
    });
  });

  it('1- Expected to create an order with id = 3', async (): Promise<void> => {
    const res = await req
      .post(`/order`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'active',
        user_id: 1,
      });
    expect(res.body).toEqual({
      id: 3,
      status: 'active',
      user_id: 1,
    });
  });

  it('2- Expected to show all orders with user_id = 1', async (): Promise<void> => {
    const res = await req
      .get('/user/1/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body).toEqual([
      {
        id: 1,
        status: 'active',
        user_id: 1,
      },
      {
        id: 2,
        status: 'complete',
        user_id: 1,
      },
      {
        id: 3,
        status: 'active',
        user_id: 1,
      },
    ]);
  });

  it('3- Expected to show current order with user_id = 1', async (): Promise<void> => {
    const res = await req
      .get('/user/1/current-order')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body).toEqual({
      id: 3,
      status: 'active',
      user_id: 1,
    });
  });

  it('4- Expected to show completed order with user_id = 1', async (): Promise<void> => {
    const res = await req
      .get('/user/1/completed-order')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body).toEqual({
      id: 2,
      status: 'complete',
      user_id: 1,
    });
  });

  it('5- Expected to add product to order with id = 1', async (): Promise<void> => {
    const res = await req
      .post('/add-product')
      .set('Authorization', `Bearer ${token}`)
      .send({
        order_id: 1,
        product_id: 1,
        quantity: 4,
      });
    expect(res.body).toEqual({
      id: 1,
      order_id: 1,
      product_id: 1,
      quantity: 4,
    });
  });

  it('6- Expected to edit order with id = 1', async (): Promise<void> => {
    const res = await req
      .post('/edit-order')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: 1,
        status: 'complete',
      });

    expect(res.body).toEqual({
      id: 1,
      status: 'complete',
      user_id: 1,
    });
  });

  afterAll(async (): Promise<void> => {
    const conn = await Client.connect();
    const sql =
      'DELETE FROM order_products;\nDELETE FROM orders;\nDELETE FROM products;\nDELETE FROM users;\nALTER SEQUENCE users_id_seq RESTART WITH 1;\nALTER SEQUENCE products_id_seq RESTART WITH 1;\nALTER SEQUENCE orders_id_seq RESTART WITH 1;\nALTER SEQUENCE order_products_id_seq RESTART WITH 1;';
    await conn.query(sql);
    conn.release();
  });
});
