import Client from '../database';
import bcrypt from 'bcrypt';

const { BCRYPT_PASSWORD: pepper, SALT_ROUNDS: saltRounds } = process.env;

export type User = {
  id?: number;
  firstname?: string;
  lastname?: string;
  email: string;
  password: string;
};

export class UserStore {
  // Read all users
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users;';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`can't get users from the database ==> ${err}`);
    }
  }

  // show a user using id
  async show(id: string): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users WHERE id = $1;';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `can't get the user with id= ${id} from the database ==> ${err}`
      );
    }
  }

  // create a user
  async create(u: User): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO users(firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING *;';
      const hash = bcrypt.hashSync(
        u.password + pepper,
        parseInt(saltRounds as string)
      );
      const result = await conn.query(sql, [
        u.firstname,
        u.lastname,
        u.email,
        hash,
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `can't create the user with email: ${u.email} ==> ${err}`
      );
    }
  }

  // user authentication
  async authentication(email: string, pass: string): Promise<User | null> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users WHERE users.email = $1;';
      const result = await conn.query(sql, [email]);
      if (result.rows.length) {
        const user: User = result.rows[0];
        conn.release();
        if (bcrypt.compareSync(pass + pepper, user.password)) {
          return user;
        }
      }
      return null;
    } catch (err) {
      throw new Error(`can't find the user with email: ${email} ==> ${err}`);
    }
  }
}
