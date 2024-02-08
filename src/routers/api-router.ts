import { NextFunction, Request, Response, Router } from "express";
import { AppError } from "../errors/AppError";
import { StatusCodes } from "http-status-codes";


export const apiRouter =  Router()



apiRouter.get("/", (req:Request, res: Response, next:NextFunction)=>{
  
    // return next(new AppError("This is my custon error", StatusCodes.BAD_REQUEST))

    return res.send("Hello world")
})