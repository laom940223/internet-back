import { Router } from "express";
import { getMehandler } from "../handlers/authHandler";



export const authRouter = Router()



    authRouter.get("/me", getMehandler)