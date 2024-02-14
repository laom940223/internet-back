import express, { NextFunction, Request, Response } from 'express'
import dotenv from "dotenv"
import helmet from 'helmet'
import morgan from 'morgan'
import { errorHandler } from './errors/error-handler'
import { Router } from "express"
import cors from 'cors'
import { apiRouter } from './routers/api-router'
import { notFound } from './utils/not-found'
import { PrismaClient } from '@prisma/client'
import { authRouter } from './routers/auth-router'

dotenv.config()
export const prisma = new PrismaClient()


const app = express()

const main = async ()=>{


    app.use(express.json())
    app.use(helmet())
    app.use(morgan("dev"))

    // res.set('Access-Control-Allow-Origin', 'http://localhost:3001');


    app.use(cors({ 
      origin: '*',
      // methods: 
    }))

    // app.use(function(req, res, next) {
    //   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    //   res.header("Access-Control-Allow-Methods", "*")
    //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //   next();
    // });

    app.use("/api",apiRouter)
    app.use("/auth", authRouter)

    app.use("*", notFound )

    app.use(errorHandler)

    app.listen(process.env.PORT, ()=>{
        console.log(`Running at port ${process.env.PORT}`)
    })

}



main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })