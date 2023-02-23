import { db } from './database/knex';
import { Users, Products, Purchase } from './database'
import { TUser, TProduct, TPurchase, Category, ProductsToBuy } from './types'
import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express();
app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get('/ping', (req: Request, res: Response) => {
    res.send('Pong!')
})


// REQUISIÇÃO GETALLUSERS

app.get('/users', async (req: Request, res: Response) => {
    try {
        const users = await db("users")
        const usersMap = users.map((user) => {
            return ({
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
                createdAt: user.created_at
            })


        })
        res.status(200).send(usersMap)
    } catch (error) {
        console.log(error)
        if (req.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

// REQUISIÇÃO CREATEUSER

app.post('/users', async (req: Request, res: Response) => {
    try {

        const id = req.body.id as string
        const name = req.body.name as string
        const email = req.body.email as string
        const password = req.body.password as string

        // const {id, name, email, password} = req.body (outro tipo de fazer)


        if (!id || !name || !email || !password) {
            res.status(404)
            throw new Error("todos os dados são obrigatórios!!")
        }

        if (typeof id !== "string" || typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
            res.status(404)
            throw new Error("todos os dados devem ser do tipo string!!")
        }

        if (id[0] !== "a") {
            res.status(404)
            throw new Error("todos os ids de usuários devem se iniciar com a letra 'a'!!")
        }

        if (name.length < 2) {
            res.status(404)
            throw new Error("todos os nomes devem ter pelo menos dois caracteres!!")
        }

        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g)) {
            res.status(404)
            throw new Error("ERRO: Password deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial!!")
        }

        if (!email.match(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/g)) {
            res.status(404)
            throw new Error("ERRO: Email deve ter o formato 'exemplo@exemplo.com'!!")
        }

        const [findId] = await db("users").where({ id })
        if (findId) {
            res.status(422)
            throw new Error("Id já cadastrada!!")
        }

        const [findEmail] = await db("users").where({ email })
        if (findEmail) {
            res.status(422)
            throw new Error("Email já cadastrado!!")
        }

        const newUser = { id, name, email, password }
        await db("users").insert(newUser)


        res.status(201).send({
            message: "Cadastro realizado com sucesso!! :D"
        })

    } catch (error) {
        console.log(error)
        if (req.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

// REQUISIÇÃO CREATEPRODUCT

app.post('/products', async (req: Request, res: Response) => {
    try {
        const id = req.body.id as string
        const name = req.body.name as string
        const price = req.body.price as number
        const description = req.body.description as string
        const image_url = req.body.image_url as string


        if (!id || !name || !price || !description || !image_url) {
            res.status(404)
            throw new Error("todos os dados são obrigatórios!!")
        }

        if (typeof id !== "string" || typeof name !== "string" || typeof price !== "number" || typeof description !== "string" || typeof image_url !== "string") {
            res.status(404)
            throw new Error("todos os dados, exceto 'price' (number), devem ser do tipo string!!")
        }

        if (id[0] !== "p") {
            res.status(404)
            throw new Error("todos os ids de produtos devem se iniciar com a letra 'p'!!")
        }

        const [findId] = await db("products").where({ id })
        if (findId) {
            res.status(422)
            throw new Error("Id já cadastrada!")
        }

        const newProduct = { id, name, price, description, image_url }
        await db("products").insert(newProduct)

        res.status(201).send({
            message: "Produto cadastrado com sucesso!! :D"
        })


    } catch (error) {
        console.log(error)
        if (req.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})




// REQUISIÇÃO GETALLPRODUCTS & REQUISIÇÃO SEARCHPRODUCTBYNAME

app.get('/products', async (req: Request, res: Response) => {
    try {
        const q = req.query.q as string | undefined
        const products = await db("products")
        const productsMap = products.map((product) => {
            return ({
                id: product.id,
                name: product.name,
                price: product.price,
                description: product.description,
                imageUrl: product.image_url
            })

        })
        console.log(q)

        if (q === undefined) {
            res.status(200).send(productsMap)
        } else {
            const productFilter = productsMap.filter((product) => {
                return product.name.toLowerCase().includes(q.toLowerCase())
            })
            res.status(200).send(productFilter)
        }

    } catch (error) {
        console.log(error)
        if (req.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


// REQUISIÇÃO EDITPRODUCTBYID

app.put('/products/:id', async (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id as string

        if (idToEdit === ":id") {
            res.status(404)
            throw new Error("Informe um id válido!!")
        }

        const [findId] = await db("products").where({ id: idToEdit })

        if (!findId) {
            res.status(422)
            throw new Error("Id não cadastrada!!")
        }


        const newId = req.body.id as string | undefined
        const newName = req.body.name as string | undefined
        const newPrice = req.body.price as number | undefined
        const newDescription = req.body.description as string | undefined
        const newImageUrl = req.body.imageUrl as string | undefined

        if (newId && typeof newId !== "string") {
            res.status(404)
            throw new Error("A Id tem que ser uma string!!")
        }

        if (newName && typeof newName !== "string") {
            res.status(404)
            throw new Error("O Name tem que ser uma string!!")
        }

        if (newPrice && typeof newPrice !== "number") {
            res.status(404)
            throw new Error("O Price tem que ser um Number!!")
        }

        if (newDescription && typeof newDescription !== "string") {
            res.status(404)
            throw new Error("A description tem que ser uma string!!")
        }

        if (newImageUrl && typeof newImageUrl !== "string") {
            res.status(404)
            throw new Error("A ImageUrl tem que ser uma string!!")
        }

        if (newId && newId[0] !== "p") {
            res.status(404)
            throw new Error("todos os ids de produtos devem se iniciar com a letra 'p'!!")
        }

        if (newId) {
            const [findNewId] = await db("products").where({ id: newId })
            if (findNewId) {
                res.status(422)
                throw new Error("Id já cadastrada!")
            }
        }


        const newProduct = {
            id: newId || findId.id,
            name: newName || findId.name,
            price: newPrice || findId.price,
            description: newDescription || findId.description,
            image_url: newImageUrl || findId.image_url
        }
        await db("products").update(newProduct).where({ id: idToEdit })

        res.status(200).send({
            message: "Produto atualizado com sucesso!! :D"
        })


    } catch (error) {
        console.log(error)
        if (req.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


// REQUISIÇÃO GETALLPRODUCTS & REQUISIÇÃO SEARCHPRODUCTBYNAME

app.get('/products', async (req: Request, res: Response) => {
    try {
        const q = req.query.q as string | undefined
        const products = await db("products")
        const productsMap = products.map((product) => {
            return ({
                id: product.id,
                name: product.name,
                price: product.price,
                description: product.description,
                imageUrl: product.image_url
            })

        })
        console.log(q)

        if (q === undefined) {
            res.status(200).send(productsMap)
        } else {
            const productFilter = productsMap.filter((product) => {
                return product.name.toLowerCase().includes(q.toLowerCase())
            })
            res.status(200).send(productFilter)
        }

    } catch (error) {
        console.log(error)
        if (req.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


// REQUISIÇÃO EDITPRODUCTBYID

app.put('/products/:id', async (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id as string

        if (idToEdit === ":id") {
            res.status(404)
            throw new Error("Informe um id válido!!")
        }

        const [findId] = await db("products").where({ id: idToEdit })

        if (!findId) {
            res.status(422)
            throw new Error("Id não cadastrada!!")
        }


        const newId = req.body.id as string | undefined
        const newName = req.body.name as string | undefined
        const newPrice = req.body.price as number | undefined
        const newDescription = req.body.description as string | undefined
        const newImageUrl = req.body.imageUrl as string | undefined

        if (newId && typeof newId !== "string") {
            res.status(404)
            throw new Error("A Id tem que ser uma string!!")
        }

        if (newName && typeof newName !== "string") {
            res.status(404)
            throw new Error("O Name tem que ser uma string!!")
        }

        if (newPrice && typeof newPrice !== "number") {
            res.status(404)
            throw new Error("O Price tem que ser um Number!!")
        }

        if (newDescription && typeof newDescription !== "string") {
            res.status(404)
            throw new Error("A description tem que ser uma string!!")
        }

        if (newImageUrl && typeof newImageUrl !== "string") {
            res.status(404)
            throw new Error("A ImageUrl tem que ser uma string!!")
        }

        if (newId && newId[0] !== "p") {
            res.status(404)
            throw new Error("todos os ids de produtos devem se iniciar com a letra 'p'!!")
        }

        if (newId) {
            const [findNewId] = await db("products").where({ id: newId })
            if (findNewId) {
                res.status(422)
                throw new Error("Id já cadastrada!")
            }
        }


        const newProduct = {
            id: newId || findId.id,
            name: newName || findId.name,
            price: newPrice || findId.price,
            description: newDescription || findId.description,
            image_url: newImageUrl || findId.image_url
        }
        await db("products").update(newProduct).where({ id: idToEdit })

        res.status(200).send({
            message: "Produto atualizado com sucesso!! :D"
        })


    } catch (error) {
        console.log(error)
        if (req.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})



// REQUISIÇÃO CREATE PURCHASE

app.post('/purchases', async (req: Request, res: Response) => {
    try {
        const id = req.body.id as string
        const buyer = req.body.buyer as string
        const products = req.body.products as ProductsToBuy[]

        if (!id || !buyer) {
            res.status(404)
            throw new Error("todos os dados são obrigatórios!!")
        }

        if (!products || products.length === 0) {
            res.status(404)
            throw new Error("Produtos não pode estar vazio!!")
        }

        if (typeof id !== "string" || typeof buyer !== "string") {
            res.status(404)
            throw new Error("todos os dados devem ser do tipo string!!")
        }

        if (id[0] !== "d") {
            res.status(404)
            throw new Error("todos os ids de purchases devem se iniciar com a letra 'd'!!")
        }

        const [findId] = await db("purchases").where({ id })
        if (findId) {
            res.status(422)
            throw new Error("Id já cadastrada!")
        }

        const [findBuyer] = await db("users").where({ id: buyer })
        if (!findBuyer) {
            res.status(422)
            throw new Error("Usuário não cadastrado!")
        }

        products.map((product) => {
            if (!product.productId || typeof product.productId !== "string") {
                res.status(422)
                throw new Error("Informe um Id em string!!")
            }

            if (!product.quantity || typeof product.quantity !== "number") {
                res.status(422)
                throw new Error("Informe uma quantity em number!!")
            }
        })

        for (const i in products) {
            const [findProduct] = await db("products").where({ id: products[i].productId })
            if (!findProduct) {
                res.status(422)
                throw new Error(`O Produto ${products[i].productId} não foi econtrado!!`)
            }
        }

        for (const i in products) {
            const newPurchase = {
                purchase_id: id,
                product_id: products[i].productId,
                quantity: products[i].quantity
            }
            await db("purchases_products").insert(newPurchase)
        }

        const cart = await db("purchases_products").where({ purchase_id: id })
        let totalPrice = 0

        const newPurchase = {
            id: cart[0].purchase_id,
            buyer: buyer,
            total_price: totalPrice
        }

        for (const product of cart) {
            const [productInCart] = await db("products").where({ id: product.product_id })
            totalPrice += product.quantity * productInCart.price
        }

        newPurchase.total_price = totalPrice

        await db("purchases").insert(newPurchase)

        const purchasedProducts: {}[] = []
        for (const i of cart) {
            const [productInCart] = await db("products").where({ id: i.product_id })
            purchasedProducts.push({
                id: productInCart.id,
                name: productInCart.name,
                price: productInCart.price,
                description: productInCart.description,
                imageUrl: productInCart.image_url,
                quantity: i.quantity
            })
        }

        const [createdPurchased] = await db("purchases").where({ id })
        const styledPurchased = {
            id: createdPurchased.id,
            buyer: createdPurchased.buyer,
            totalPrice: createdPurchased.total_price,
            products: purchasedProducts
        }


        res.status(201).send({
            message: "Pedido realizado com sucesso!! :D",
            purchased: styledPurchased
        })



    } catch (error) {
        console.log(error)
        if (req.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


// REQUISIÇÃO DELETEPURCHASEBYID

app.delete('/purchases/:id', async (req: Request, res: Response) => {
    try {

        const idToDelete = req.params.id

        if (idToDelete === ":id") {
            res.status(404)
            throw new Error("Informe uma Id!!")
        }

        const [findId] = await db("purchases").where({ id: idToDelete })
        if (findId) {
            await db("purchases").del().where({ id: idToDelete })
            await db("purchases_products").del().where({ purchase_id: idToDelete })
            res.status(200).send({
                message: "Pedido cancelado com sucesso"
            })
        } else {
            res.status(404)
            throw new Error("Compra não encontrada!!")
        }


    } catch (error) {
        console.log(error)
        if (req.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})




// REQUISIÇÃO GETPURCHASEBYID


app.get('/purchases/:id', async (req: Request, res: Response) => {
    try {

        const getId = req.params.id

        if (getId === ":id") {
            res.status(404)
            throw new Error("Informe uma Id!!")
        }

        const [foundIdInPurchases] = await db("purchases_products").where({ purchase_id: getId })
        if (!foundIdInPurchases) {
            res.status(404)
            throw new Error("Faltam informações sobre essa compra!!")
        }

        

        const [foundIdInProducts] = await db("purchases").where({ id: getId })
        if (foundIdInProducts) {
            const [buyer] = await db("users").where({ id: foundIdInProducts.buyer })
            if (!buyer) {
                res.status(404)
                throw new Error("Faltam informações sobre o cliente/comprador!!")
            }
            const styledPurchased = {
                purchaseId:foundIdInProducts.id,
                buyerId:foundIdInProducts.buyer,
                buyerName:buyer.name,
                buyerEmail:buyer.email,
                totalPrice:foundIdInProducts.total_price,
                createdAt:foundIdInProducts.created_at,
                paid:foundIdInProducts.paid,
                products:[] as {}[]
        }

        const foundInPurchases = await db("purchases_products").where({ purchase_id: getId })

        for (const product of foundInPurchases) {
            const [BuyedProduct] = await db("products").where({ id: product.product_id })
            if (!BuyedProduct) {
                res.status(404)
                throw new Error("Faltam informações sobre o produto!!")
            }
        }

        for (const product of foundInPurchases) {
            const [BuyedProduct] = await db("products").where({ id: product.product_id })
            styledPurchased.products.push({
                id: BuyedProduct.id,
                name: BuyedProduct.name,
                price: BuyedProduct.price,
                description: BuyedProduct.description,
                imageUrl: BuyedProduct.image_url,
                quantity: product.quantity
            })
        }

        res.status(200).send(styledPurchased)
    }
        } catch (error) {
            console.log(error)
            if (req.statusCode === 200) {
                res.status(500)
            }
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    })





// purchaseId: "pur001",
//     buyerId: "u001",
//     buyerName: "Fulano",
//     buyerEmail: "fulano@email.com",
//     totalPrice: 1400,
//     createdAt: "2023-01-15 16:24:54",
//     paid: 0,
//     products: [
//         {
//             id: "prod001",
//             name: "Mouse gamer",
//             price: 250,
//             description: "Melhor mouse do mercado!",
//             imageUrl: "https://picsum.photos/seed/Mouse%20gamer/400",
//             quantity: 2
//         },
//         {
//             id: "prod002",
//             name: "Monitor",
//             price: 900,
//             description: "Monitor LED Full HD 24 polegadas",
//             imageUrl: "https://picsum.photos/seed/Monitor/400",
//             quantity: 1
//         }
//     ]
// }