import express, { Request, Response } from 'express';
import cors from 'cors';
import orderRoutes from './handlers/orders';
import productRoutes from './handlers/products';
import userRoutes from './handlers/users';

const app: express.Application = express();
const port = 3200;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/', function (req: Request, res: Response): void {
  res.send('Storefront API project');
});

productRoutes(app);
orderRoutes(app);
userRoutes(app);

app.listen(port, function (): void {
  console.log(`starting app on: http://localhost:${port}`);
});

export default app;
