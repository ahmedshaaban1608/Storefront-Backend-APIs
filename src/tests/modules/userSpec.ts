import Client from '../../database';
import { UserStore } from '../../modules/user';

const store = new UserStore();

describe('test users table methods', (): void => {
  it('1- Expect index method to be defined', (): void => {
    expect(store.index).toBeDefined();
  });

  it('2- Expect create method to be defined', (): void => {
    expect(store.create).toBeDefined();
  });

  it('3- Expect show method to be defined', (): void => {
    expect(store.show).toBeDefined();
  });

  it('4- Expect authentication method to be defined', (): void => {
    expect(store.show).toBeDefined();
  });

  it('5- Expect to return all users from database', async (): Promise<void> => {
    const result = await store.index();
    expect(result).toEqual([]);
  });

  it('6- Expect to create a user', async (): Promise<void> => {
    const result = await store.create({
      firstname: 'Ahmed',
      lastname: 'Shaaban',
      email: 'abc@test.com',
      password: '123456789',
    });
    expect(result.id).toEqual(1);
    expect(result.firstname).toEqual('Ahmed');
    expect(result.lastname).toEqual('Shaaban');
    expect(result.email).toEqual('abc@test.com');
  });

  it('7- Expect to return a user with id = 1 from database', async (): Promise<void> => {
    const result = await store.show('1');
    expect(result.id).toEqual(1);
    expect(result.firstname).toEqual('Ahmed');
    expect(result.lastname).toEqual('Shaaban');
    expect(result.email).toEqual('abc@test.com');
  });

  it('8- Expect to return a user after successful authentication', async (): Promise<void> => {
    const result = await store.authentication('abc@test.com', '123456789');
    expect(result?.id).toEqual(1);
    expect(result?.firstname).toEqual('Ahmed');
    expect(result?.lastname).toEqual('Shaaban');
    expect(result?.email).toEqual('abc@test.com');
  });

  it('9- Expect to return null because of failed authentication', async (): Promise<void> => {
    const result = await store.authentication('abc@test.com', '3456789');
    expect(result).toBeNull();
  });

  afterAll(async (): Promise<void> => {
    const conn = await Client.connect();
    const sql =
      'DELETE From users;\nALTER SEQUENCE users_id_seq RESTART WITH 1;';
    await conn.query(sql);
    conn.release();
  });
});
