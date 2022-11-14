import Client from '../../database';
import { OrderStore } from '../../modules/order';
import { ProductStore } from '../../modules/product';
import { UserStore } from '../../modules/user';

const store = new OrderStore();
const user = new UserStore();
const product = new ProductStore();

describe('test orders table methods', (): void => {
  beforeAll(async (): Promise<void> => {
    await user.create({
      firstname: 'test',
      lastname: 'user',
      email: 'test@test.com',
      password: '123456',
    });
    await product.create({ name: 'shoes', price: 400 });

    await store.create({ status: 'active', user_id: 1 });

    await store.create({ status: 'complete', user_id: 1 });
  });

  it('1- Expect userOrders method to be defined', (): void => {
    expect(store.userOrders).toBeDefined();
  });

  it('2- Expect currentOrder method to be defined', (): void => {
    expect(store.currentOrder).toBeDefined();
  });

  it('3- Expect completedOrder method to be defined', (): void => {
    expect(store.completedOrder).toBeDefined();
  });

  it('4- Expect create method to be defined', (): void => {
    expect(store.create).toBeDefined();
  });

  it('5- Expect addProducts method to be defined', (): void => {
    expect(store.addProducts).toBeDefined();
  });

  it('6- Expect edit method to be defined', (): void => {
    expect(store.edit).toBeDefined();
  });

  it('7- Expect to create order', async (): Promise<void> => {
    const result = await store.create({
      status: 'active',
      user_id: 1,
    });
    expect(result).toEqual({
      id: 3,
      status: 'active',
      user_id: 1,
    });
  });

  it('8- Expect to get all orders by  user id = 1', async (): Promise<void> => {
    const result = await store.userOrders('1');

    expect(result.length).toEqual(3);
  });

  it('9- Expect to get current order by  user id = 1', async (): Promise<void> => {
    const result = await store.currentOrder('1');
    expect(result).toEqual({
      id: 3,
      status: 'active',
      user_id: 1,
    });
  });

  it('10- Expect to get completed orders by  user id = 1', async (): Promise<void> => {
    const result = await store.completedOrder('1');
    expect(result).toEqual({
      id: 2,
      status: 'complete',
      user_id: 1,
    });
  });

  it('11- Expect to add product to order by  user id = 1', async (): Promise<void> => {
    const result = await store.addProducts('1', '1', '4');
    expect(result).toEqual({
      id: 1,
      order_id: 1,
      product_id: 1,
      quantity: 4,
    });
  });

  it('12- Expect to update an order with id = 1', async (): Promise<void> => {
    const result = await store.edit('1', 'complete');
    expect(result).toEqual({
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
