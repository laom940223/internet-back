import { NextFunction, Request, Response } from "express";
import { prisma } from "..";
import { buildResponse } from "../utils/server-response";
import { StatusCodes } from "http-status-codes";
import { FieldValidationError, validationResult } from "express-validator";
import { toMyValidation } from "../errors/ValidationError";
import { AppError } from "../errors/AppError";
import { Prisma } from "@prisma/client";



export const getAllUserRoles = async (req: Request, res: Response, next: NextFunction)=>{

    const userRoles = await prisma.userRole.findMany()
    return res.json(

        buildResponse(StatusCodes.OK, userRoles)
    )
}


export const deleteUserRoleById = async (req: Request, res: Response)=>{


    try{

        await prisma.userRole.delete({ where:{ id: +req.params.id} })
    }catch(e){

    }
        

    return res.json( buildResponse(StatusCodes.OK))

}

export const getUserRoleById =async (req: Request, res: Response, next: NextFunction)=>{

    const userRoleId =  req.params.id

    if(!userRoleId) return next(new AppError("Please provide a valid id", StatusCodes.BAD_REQUEST))

    return res.json( buildResponse( StatusCodes.OK, 
        await prisma.userRole.findUnique( {

            where:{
                id: +userRoleId
            }
        })
        ) )
}


export const createUserRole = async (req: Request, res: Response, next: NextFunction)=>{
    const result = validationResult(req)

    if(!result.isEmpty()){
        const transformed = toMyValidation( result.array() as FieldValidationError[] )
        return next(
            new AppError("Please check your request", StatusCodes.BAD_REQUEST, transformed )
        )        
    }

    try{
        const createdUserRole = await prisma.userRole.create({ data: { name: req.body.name }})
        res.status(StatusCodes.CREATED)
        return res.json(
            buildResponse(StatusCodes.CREATED, createdUserRole)    
        )
    }catch(e){

        if(e instanceof Prisma.PrismaClientKnownRequestError){
            if(e.code ==="P2002"){

                return next( new AppError("Unique constrain validation failed", StatusCodes.BAD_REQUEST, [{  field:"name", message:"This name is already in use" }]) )
            }
        }
        return next(new AppError("Something went wrong", StatusCodes.INTERNAL_SERVER_ERROR))
    }
}



