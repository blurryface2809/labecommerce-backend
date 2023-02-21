-- Active: 1676991270631@@127.0.0.1@3306
CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);

SELECT * FROM users;
INSERT INTO users (id,name,email,password)
VALUES("a01","PEPEP","PEPEP@EMAIL.COM","12345");
DROP TABLE users;
CREATE TABLE purchases (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    buyer TEXT FOREIGN KEY NOT NULL,
    total_price REAL NOT NULL, 
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    paid INTEGER NOT NULL
);

CREATE TABLE products (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL
);

CREATE TABLE purchases_products (
    purchase_id TEXT FOREIGN KEY NOT NULL,
    product_id TEXT FOREIGN KEY NOT NULL,
    quantity INTEGER NOT NULL
);

