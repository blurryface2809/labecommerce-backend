import { db } from './database/knex';
import { Users, Products, Purchase } from './database'
import { TUser, TProduct, TPurchase, Category } from './types'
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
        const frescura = users.map((user)=>{
            return({
            id:user.id,
            name:user.name,
            email:user.email,
            password:user.password,
            createdAt:user.created_at
        })
        

        })
            res.status(200).send(frescura)
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
            throw new Error ("todos os dados são obrigatórios!!")
        }

        if ( typeof id !== "string" || typeof name !== "string" || typeof email !== "string" || typeof password !== "string"){
            res.status(404)
            throw new Error ("todos os dados devem ser do tipo string!!")
        }

        if ( id[0] !== "a") {
            res.status(404)
            throw new Error ("todos os ids devem iniciar com a letra 'a'!!")
        }

        if ( name.length < 2) {
            res.status(404)
            throw new Error ("todos os nomes devem ter pelo menos dois caracteres")
        }

        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g)) {
            res.status(404)
            throw new Error("ERRO: Password deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
        }

        if (!email.match(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/g)) {
            res.status(404)
            throw new Error("ERRO: Email deve ter o formato 'exemplo@exemplo.com'.")
        }

        const [findId] = await db("users").where({id})
        if (findId) {
            res.status(422)
            throw new Error("Id já cadastrada!")
        }

        const [findEmail] = await db("users").where({email})
        if (findEmail) {
            res.status(422)
            throw new Error("Email já cadastrado!")
        }

        const newUser = {id,name,email,password}
        await db("users").insert(newUser)

        
            res.status(201).send({
                message: "Cadastro realizado com sucesso"
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



// REQUISIÇÃO GETALLPRODUCTS

app.get('/products', (req: Request, res: Response) => {
    res.status(200).send(Products)
})


// REQUISIÇÃO SEARCHPRODUCTBYNAME

app.get('/product/search', (req: Request, res: Response) => {
    const q = req.query.q
    console.log(q)
    res.status(200).send(Products)
})

