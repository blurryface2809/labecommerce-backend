import { Console } from "console";
import { TUser, TPurchase, TProduct, Category } from "./types";

export const Users: TUser[] = [
    
    {
        id: "user01",
        email: "user01@email.com",
        password: "010101"
    },
    {
        id: "user02",
        email: "user02@email.com",
        password: "020202"
    },
    {
        id: "user03",
        email: "user03@email.com",
        password: "030303"
    },
]


export const Products: TProduct[] = [
    {
        id: "f011",
        name: "Conjunto de Jardinagem - 4 peças",
        price: 30,
        category: Category.SETS
    },
    {
        id: "a009",
        name: "Par de Brincos - Cerejas",
        price: 18,
        category: Category.ACCESSORIES
    },
    {
        id: "e029",
        name: "Tablet IOS 17'",
        price: 450,
        category: Category.ELECTRONICS
    },
]



export const Purchase: TPurchase[] = [
    {  
        userId: "user02",
        productId: "e029",
        quantity: 1,
        totalPrice: 450
    },
    {  
        userId: "user02",
        productId: "f011",
        quantity: 1,
        totalPrice: 30
    },
    {  
        userId: "user03",
        productId: "a009",
        quantity: 2,
        totalPrice: 36
    },
]



//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //



// CRIAR USUÁRIO

export const createUser = (userId: string, userEmail: string, userPassword: string) => {
    Users.push({
        id: userId, 
        email: userEmail, 
        password: userPassword
    })
    
    console.log("Cadastro realizado com sucesso!")
}


// BUSCAR TODOS OS USUÁRIOS

export const getAllUsers = () => {
    console.table(Users)
}


// CRIAR PRODUTO

export const createProduct = (productId: string, productName: string, productPrice: number, productCategory: Category) => {
    Products.push({
        id: productId, 
        name: productName, 
        price: productPrice, 
        category:productCategory
    })

    console.log("Produto criado com sucesso!")
}


// BUSCAR TODOS OS PRODUTOS

export const getAllProducts = () => {
    console.table(Products)
}


// BUSCAR PRODUTO PELA ID

export const getProductById = (idToSearch: string) => {
    const foundProductId = Products.filter((item) => item.id === idToSearch)
    
    foundProductId.length === 0 ? console.log("Produto não encontrado!") : console.log("Produto encontrado:" + foundProductId)
}


// BUSCA PRODUTOS SE BASEANDO EM UMA LISTA (PRODUCTS)

export const queryProductsByName  = (q: string) => {
    const foundProductId = Products.filter((item) => item.name.toLowerCase() === q)
    
    foundProductId.length == 0 ? console.log("Produto não encontrado!") : console.log("Produto encontrado:" + foundProductId)
}


// CRIA UMA COMPRA (PURCHASE)

export const createPurchase  = (userId: string, productId: string, quantity: number) => {
    Purchase.push({
        userId: userId, 
        productId: productId, 
        quantity: quantity, 
        totalPrice: quantity * Products[2].price
    })
    
    console.log("Compra realizada com sucesso!")
}


// BUSCA TODAS AS COMPRAS FEITAS PELO USERID

export const getAllPurchasesFromUserId   = (userIdToSearch: string) => {
    const foundProductId = Purchase.filter((item) => item.userId === userIdToSearch)
    
    foundProductId.length == 0 ? console.log("Usuário não encontrado!") : console.log("Usuário Encontrado:" + foundProductId)

}
