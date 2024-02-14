import nodemailer from 'nodemailer'
import express from 'express'
import https from 'https'
import session from 'express-session'
import dotenv from "dotenv"
import helmet from 'helmet'
import fs from 'fs'
import morgan from 'morgan'
import { errorHandler } from './errors/error-handler'
import cors from 'cors'
import { apiRouter } from './routers/api-router'
import { notFound } from './utils/not-found'
import { PrismaClient, UserRole } from '@prisma/client'
import { authRouter } from './routers/auth-router'
import { authenticationMiddleware } from './middleware/authentication-middleware'

dotenv.config()
export const prisma = new PrismaClient()

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

declare module 'express-session' {
  interface Session {
    user: {
      // Your custom properties go here
      email: string;
      usertype: UserRole
      // Add more properties as needed
    };
  }
}


const app = express()

const main = async ()=>{


    app.use(express.json())
    app.use(helmet())
    app.use(morgan("dev"))


    

    app.use(session({
      secret: 'Fix this issue',
      resave: false,
      saveUninitialized: true,
  
      cookie: { 

        secure: true,
        httpOnly: true,
        sameSite:"none",
        maxAge: 1000 * 60 * 60 * 24 * 7
      }
    }))


    app.use(cors({ 
      origin: 'https://localhost:5173',

      credentials:true
      // methods: 
    }))

    // app.use(function(req, res, next) {
    //   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    //   res.header("Access-Control-Allow-Methods", "*")
    //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //   next();
    // });

    app.use("/api", authenticationMiddleware,apiRouter)
    app.use("/auth", authRouter)

    app.use("*", notFound )

    app.use(errorHandler)

    https.createServer({
      key: fs.readFileSync('./certs/server-key.pem'),
      cert: fs.readFileSync('./certs/server-cert.pem'),
    },app).listen(process.env.PORT, function(){
     console.log(`Servidor https correindo en el puerto ${process.env.PORT}`);
   });

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