CREATE TABLE orders(
    id SERIAL PRIMARY KEY,
    status VARCHAR(40) NOT NULL,
    user_id integer REFERENCES users(id)
);