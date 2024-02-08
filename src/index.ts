import express, { NextFunction, Request, Response } from 'express'
import dotenv from "dotenv"
import helmet from 'helmet'
import morgan from 'morgan'
import { errorHandler } from './errors/error-handler'
import { Router } from "express"
import { apiRouter } from './routers/api-router'
import { notFound } from './utils/not-found'
import { PrismaClient } from '@prisma/client'

dotenv.config()
export const prisma = new PrismaClient()


const app = express()

const main = async ()=>{


    app.use(express.json())
    app.use(helmet())
    app.use(morgan("dev"))


    app.use("/api",apiRouter)

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