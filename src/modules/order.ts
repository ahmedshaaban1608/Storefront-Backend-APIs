import Client from '../database';

export type Order = {
  id?: number;
  status: string;
  user_id: number;
};

export type OrderProducts = {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
};

export class OrderStore {
  // Read all a user orders
  async userOrders(id: string): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders WHERE user_id = $1;';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(
        `can't get orders by user with user id = ${id} from the database ==> ${err}`
      );
    }
  }

  // Read current order by a user
  async currentOrder(id: string): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC;';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `can't get current order with user id = ${id} from the database ==> ${err}`
      );
    }
  }

  // completed order by a user
  async completedOrder(id: string): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT * FROM orders WHERE user_id = $1 AND status = 'complete';`;
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `can't get completed orders by user id = ${id} from the database ==> ${err}`
      );
    }
  }

  // create order by a user
  async create(o: Order): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO orders (status, user_id) VALUES ($1, $2) RETURNING *;';
      const result = await conn.query(sql, [o.status, o.user_id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`can't create the order ==> ${err}`);
    }
  }

  // add products to order
  async addProducts(
    order_id: string,
    product_id: string,
    quantity: string
  ): Promise<OrderProducts> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT status FROM orders WHERE id = $1;';
      const result = await conn.query(sql, [order_id]);
      const orderStatus = result.rows[0].status;
      if (orderStatus !== 'active') {
        throw new Error(
          `Could not add product, because order status is ${orderStatus}`
        );
      }

      try {
        const conn = await Client.connect();
        const sql =
          'INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2,$3) RETURNING *;';
        const result = await conn.query(sql, [order_id, product_id, quantity]);
        conn.release();
        return result.rows[0];
      } catch (err) {
        throw new Error(`can't add products to the order ==> ${err}`);
      }
    } catch (err) {
      throw new Error(`can't find order with id ${order_id} ==> ${err}`);
    }
  }

  // update order status by a user
  async edit(id: string, status: string): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = 'UPDATE orders SET status = $2 WHERE id = $1 RETURNING *;';
      const result = await conn.query(sql, [id, status]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`can't update the order with id = ${id} ==> ${err}`);
    }
  }
}
