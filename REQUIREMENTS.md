# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index 
```
[GET] `/products`
```
- Show (args: product id)
```
[GET] `/products/:id`
```
- Create [token required]
```
[POST] `/products`
```
- Delete (args: product id)[token required]
```
[DELETE] `/products`
```

#### Users
- Index [token required]
```
[GET] `/users`
```
- Show (args: user id)[token required]
```
[GET] `/users/:id`
```
- Create [token required]
```
[POST] `/users`
```
- authentication(args: user email & user password) [token required]
```
[POST] `/users/authenticate`
```
#### Orders
- Create [token required]
```
[POST] `/order`
```
- edit [token required]
```
[POST] `/edit-order`
```
- all Orders by user (args: user id)[token required]
```
[GET] `/user/:id/orders`
```
- Current Order by user (args: user id)[token required]
```
[GET] `/user/:id/current-order`
```
- Completed Orders by user (args: user id)[token required]
```
[GET] `/user/:id/completed-order`
```
- add product to order if order status = 'open [token required]
```
[POST] `/add-product`
```
## Data Shapes
#### Product
-  id
- name
- price
```
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price integer NOT NULL
);
```

#### User
- id
- firstname
- lastname
- email
- password
```
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);
```

#### Orders
- id
- status of order (active or complete)
- user_id
```
CREATE TABLE orders(
    id SERIAL PRIMARY KEY,
    status VARCHAR(40) NOT NULL,
    user_id integer REFERENCES users(id)
);
```

### Order_products table
- id
- order_id
- product_id
- quantity

```
CREATE TABLE order_products(
    id SERIAL PRIMARY KEY,
    order_id integer REFERENCES orders(id) NOT NULL,
    product_id integer REFERENCES products(id) NOT NULL,
    quantity integer NOT NULL
);
```
