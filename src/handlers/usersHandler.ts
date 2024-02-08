import { NextFunction, Request, Response } from "express";
import { prisma } from "..";
import { buildResponse } from "../utils/server-response";
import { StatusCodes } from "http-status-codes";
import { FieldValidationError, validationResult } from "express-validator";
import { MyValidationError, toMyValidation } from "../errors/ValidationError";
import { AppError } from "../errors/AppError";



export const getAllUsers = async (req:Request, res:Response, next: NextFunction)=>{

    const users = await prisma.user.findMany()
    res.status(StatusCodes.OK)
    return res.json( buildResponse(StatusCodes.OK, users) )

}


export const createUser = async (req:Request, res: Response, next: NextFunction)=>{

    const result = validationResult(req)

    if(!result.isEmpty()){

        const transformed = toMyValidation( result.array() as FieldValidationError[] )

        return next(
            new AppError("Please check your request", StatusCodes.BAD_REQUEST, transformed )
        )        
    }


    // return toMyValidation( result.array() as FieldValidationError[] )toMyValidation( result.array() as FieldValidationError[] ) next(new AppError("This is taken", StatusCodes.BAD_REQUEST, [{ field:"email", message:"This field is already taken" }]))

    return res.send(req.body)

}