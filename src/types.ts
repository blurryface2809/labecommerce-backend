// Types:

// user
// É a pessoa cliente cadastrada.

// id (string)
// email (string)
// password (string)

export type TUser = {
    id: string,
    email: string,
    password: string
};

// product
// É o produto cadastrado.

// id (string)
// name (string)
// price (number)
// category (string)

export type TProduct = {
    id: string,
    name: string,
    price: number,
    category: Category
};

//Vou ter que criar um ENUM pra 'category'

export enum Category {
    ACCESSORIES = "Acessórios",
    SETS = "Conjuntos",
    ELECTRONICS = "Eletrônicos"
};

// purchase
// É a compra realizada por cliente.

// userId (string)
// productId (string)
// quantity (number)
// totalPrice (number)

export type TPurchase = {
    userId: string,
    productId: string,
    quantity: number,
    totalPrice: number
};

