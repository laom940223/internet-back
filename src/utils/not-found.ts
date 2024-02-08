import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { StatusCodes } from "http-status-codes";


export const notFound = (req: Request, res: Response, next: NextFunction)=>{


        return next( new AppError("The page you are looking for was not found", StatusCodes.NOT_FOUND))


}