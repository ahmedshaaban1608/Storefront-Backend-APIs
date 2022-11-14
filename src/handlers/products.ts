import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../modules/product';
import verifyAuthToken from '../utilities/token';
const store = new ProductStore();

const index = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err) {
    res.json(err);
  }
};

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await store.show(req.params.id);
    res.json(products);
  } catch (err) {
    res.json(err);
  }
};

const create = async (req: Request, res: Response): Promise<void> => {
  const product: Product = {
    name: req.body.name,
    price: req.body.price,
  };
  try {
    const newProduct = await store.create(product);
    res.json(newProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await store.delete(req.body.id);
    res.json(products);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const productRoutes = (app: express.Application): void => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', verifyAuthToken, create);
  app.delete('/products', verifyAuthToken, remove);
};

export default productRoutes;
