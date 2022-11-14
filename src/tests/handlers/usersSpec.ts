import Client from '../../database';

const url = `http://localhost:3200`;

describe('test user routes', (): void => {
  let token = '';
  it('1- test creating a user', async (): Promise<void> => {
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
    expect(result.newUser.id).toEqual(1);
    expect(result.newUser.email).toEqual('user@test.com');
  });

  it('2- test showing all users', async (): Promise<void> => {
    const res = await fetch(`${url}/users`, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await res.json();

    expect(res.status).toBe(200);
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual(1);
    expect(result[0].email).toEqual('user@test.com');
    expect(result[0].firstname).toEqual('test');
  });

  it('3- test showing a user with id = 1', async (): Promise<void> => {
    const res = await fetch(`${url}/users/1`, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await res.json();

    expect(res.status).toBe(200);
    expect(result.id).toEqual(1);
    expect(result.email).toEqual('user@test.com');
    expect(result.firstname).toEqual('test');
  });

  it('4- Expect to return a user after successful authentication', async (): Promise<void> => {
    const res = await fetch(`${url}/users/authenticate`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: 'user@test.com',
        password: '123456',
      }),
    });
    const result = await res.json();
    token = result.token;
    expect(result.authenticatdUser.id).toEqual(1);
    expect(result.authenticatdUser.email).toEqual('user@test.com');
  });

  it('5- Expect to return a null after failed authentication', async (): Promise<void> => {
    const res = await fetch(`${url}/users/authenticate`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: 'user@test.com',
        password: 'wd6532a',
      }),
    });
    const result = await res.json();
    expect(result.authenticatdUser).toBeNull();
  });

  afterAll(async (): Promise<void> => {
    const conn = await Client.connect();
    const sql =
      'DELETE From users;\nALTER SEQUENCE users_id_seq RESTART WITH 1;';
    await conn.query(sql);
    conn.release();
  });
});
