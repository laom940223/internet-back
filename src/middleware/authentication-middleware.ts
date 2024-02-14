import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { StatusCodes } from "http-status-codes";



export const authenticationMiddleware = async(req: Request, res: Response, next: NextFunction)=>{


    if( !req.session.user) return next(new AppError("Unauthorized", StatusCodes.UNAUTHORIZED))

    return next()

}