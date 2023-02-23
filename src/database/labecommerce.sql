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
    buyer TEXT NOT NULL,
    total_price REAL NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    paid INTEGER DEFAULT(0) NOT NULL,
    FOREIGN KEY (buyer) REFERENCES users(id)
);

INSERT INTO purchases (id,buyer,total_price)
VALUES("d01","a01",50);
SELECT * FROM purchases;

CREATE TABLE products (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL
);

SELECT * FROM products;
INSERT INTO products (id,name,price,description,image_url)
VALUES("p01","Tamagotchi",10,"Bichinho Virtual","https://picsum.photos/200/300");
DROP TABLE products;




CREATE TABLE purchases_products (
    purchase_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY(purchase_id) REFERENCES purchases(id)
    FOREIGN KEY(product_id) REFERENCES products(id)
);

SELECT * FROM purchases_products;
