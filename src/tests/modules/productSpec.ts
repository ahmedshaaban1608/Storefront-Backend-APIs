import { ProductStore } from '../../modules/product';
import Client from '../../database';

const store = new ProductStore();

describe('test products table methods', (): void => {
  it('1- Expect index method to be defined', (): void => {
    expect(store.index).toBeDefined();
  });

  it('2- Expect create method to be defined', (): void => {
    expect(store.create).toBeDefined();
  });

  it('3- Expect show method to be defined', (): void => {
    expect(store.show).toBeDefined();
  });

  it('4- Expect delete method to be defined', (): void => {
    expect(store.show).toBeDefined();
  });

  it('5- Expect to return all products from database', async (): Promise<void> => {
    const result = await store.index();
    expect(result).toEqual([]);
  });

  it('6- Expect to create a product', async (): Promise<void> => {
    const result = await store.create({
      name: 'summer bag',
      price: 200,
    });
    expect(result).toEqual({
      id: 1,
      name: 'summer bag',
      price: 200,
    });
  });

  it('7- Expect to return a product with id = 1 from database', async (): Promise<void> => {
    const result = await store.show('1');
    expect(result).toEqual({
      id: 1,
      name: 'summer bag',
      price: 200,
    });
  });

  it('8- Expect to delete a product with id = 1 from database', async (): Promise<void> => {
    const result = await store.delete('1');
    expect(result).toEqual({
      id: 1,
      name: 'summer bag',
      price: 200,
    });
  });

  afterAll(async (): Promise<void> => {
    const conn = await Client.connect();
    const sql =
      'DELETE FROM products;\nALTER SEQUENCE products_id_seq RESTART WITH 1;';
    await conn.query(sql);
    conn.release();
  });
});
