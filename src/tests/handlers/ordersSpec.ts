import Client from '../../database';
const url = `http://localhost:3200`;

describe('test Order routes', (): void => {
  let token = '';
  beforeAll(async (): Promise<void> => {
    // create a user
    const res = await fetch(`${url}/users`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstname: 'test',
        lastname: 'user',
        email: 'user@test.com',
        password: '123456',
      }),
    });
    const result = await res.json();
    token = result.token;

    // create a product
    await fetch(`${url}/products`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: 'shoes',
        price: 300,
      }),
    });

    // create order with status = open
    await fetch(`${url}/order`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: 'active',
        user_id: 1,
      }),
    });

    // create order with status = completed
    await fetch(`${url}/order`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: 'complete',
        user_id: 1,
      }),
    });
  });

  it('1- Expected to create an order with id = 3', async (): Promise<void> => {
    const res = await fetch(`${url}/order`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: 'active',
        user_id: 1,
      }),
    });
    const newOrder = await res.json();
    expect(newOrder).toEqual({
      id: 3,
      status: 'active',
      user_id: 1,
    });
  });

  it('2- Expected to show all orders with user_id = 1', async (): Promise<void> => {
    const res = await fetch(`${url}/user/1/orders`, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const orders = await res.json();
    expect(orders).toEqual([
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
    const res = await fetch(`${url}/user/1/current-order`, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const currentOrder = await res.json();
    expect(currentOrder).toEqual({
      id: 3,
      status: 'active',
      user_id: 1,
    });
  });

  it('4- Expected to show completed order with user_id = 1', async (): Promise<void> => {
    const res = await fetch(`${url}/user/1/completed-order`, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const completedOrder = await res.json();
    expect(completedOrder).toEqual({
      id: 2,
      status: 'complete',
      user_id: 1,
    });
  });

  it('5- Expected to add product to order with id = 1', async (): Promise<void> => {
    const res = await fetch(`${url}/add-product`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        order_id: 1,
        product_id: 1,
        quantity: 4,
      }),
    });
    const addProduct = await res.json();
    expect(addProduct).toEqual({
      id: 1,
      order_id: 1,
      product_id: 1,
      quantity: 4,
    });
  });

  it('6- Expected to edit order with id = 1', async (): Promise<void> => {
    const res = await fetch(`${url}/edit-order`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: 1,
        status: 'complete',
      }),
    });
    const order = await res.json();
    expect(order).toEqual({
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
