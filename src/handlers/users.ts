import express, { Request, Response } from 'express';
import { User, UserStore } from '../modules/user';
import verifyAuthToken from '../utilities/token';
import jwt from 'jsonwebtoken';

const store = new UserStore();

const index = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (err) {
    res.json(err);
  }
};

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await store.show(req.params.id);
    res.json(users);
  } catch (err) {
    res.json(err);
  }
};

const create = async (req: Request, res: Response): Promise<void> => {
  const user: User = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
  };
  try {
    const newUser = await store.create(user);
    const token = jwt.sign(
      { user: newUser },
      process.env.TOKEN_SECRET as string
    );
    res.json({ newUser, token });
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const authentication = async (req: Request, res: Response): Promise<void> => {
  const user: User = {
    email: req.body.email,
    password: req.body.password,
  };
  try {
    const authenticatdUser = await store.authentication(
      user.email,
      user.password
    );
    const token = jwt.sign(
      { user: authenticatdUser },
      process.env.TOKEN_SECRET as string
    );
    res.json({ authenticatdUser, token });
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const userRoutes = (app: express.Application): void => {
  app.get('/users', verifyAuthToken, index);
  app.get('/users/:id', verifyAuthToken, show);
  app.post('/users', create);
  app.post('/users/authenticate', verifyAuthToken, authentication);
};

export default userRoutes;
