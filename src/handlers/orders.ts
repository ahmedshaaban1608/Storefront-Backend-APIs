import express, { Request, Response } from 'express';
import { Order, OrderStore } from '../modules/order';
import verifyAuthToken from '../utilities/token';
const store = new OrderStore();

const userOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await store.userOrders(req.params.id);
    res.json(orders);
  } catch (err) {
    res.json(err);
  }
};

const currentOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await store.currentOrder(req.params.id);
    res.json(order);
  } catch (err) {
    res.json(err);
  }
};

const completedOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await store.completedOrder(req.params.id);
    res.json(order);
  } catch (err) {
    res.json(err);
  }
};

const create = async (req: Request, res: Response): Promise<void> => {
  const order: Order = {
    status: req.body.status,
    user_id: req.body.user_id,
  };
  try {
    const newOrder = await store.create(order);
    res.json(newOrder);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const addProducts = async (req: Request, res: Response): Promise<void> => {
  const order_id: string = req.body.order_id;
  const product_id: string = req.body.product_id;
  const quantity: string = req.body.quantity;

  try {
    const product = await store.addProducts(order_id, product_id, quantity);
    res.json(product);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const edit = async (req: Request, res: Response): Promise<void> => {
  const id: string = req.body.id;
  const status: string = req.body.status;

  try {
    const Order = await store.edit(id, status);
    res.json(Order);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const orderRoutes = (app: express.Application): void => {
  app.get('/user/:id/orders', verifyAuthToken, userOrders);
  app.get('/user/:id/current-order', verifyAuthToken, currentOrder);
  app.get('/user/:id/completed-order', verifyAuthToken, completedOrder);
  app.post('/order', verifyAuthToken, create);
  app.post('/add-product', verifyAuthToken, addProducts);
  app.post('/edit-order', verifyAuthToken, edit);
};

export default orderRoutes;
