import { NextFunction, Request, Response } from "express";
import { buildResponse } from "../utils/server-response";
import { StatusCodes } from "http-status-codes";
import { prisma } from "..";
import { evaluateValidationResult } from "../utils/validation-result";
import { FieldValidationError, validationResult } from "express-validator";
import { toMyValidation } from "../errors/ValidationError";
import { AppError } from "../errors/AppError";




export const getAllRanchs = async (req:Request, res: Response, next: NextFunction)=>{

    return res.json(

        buildResponse(StatusCodes.OK, 
            await prisma.ranch.findMany()    
        )
    )

}


export const getRanchById = async (req: Request, res: Response, next: NextFunction)=>{


    evaluateValidationResult(req, next)

    console.log(req.params)

    return res.json(
        buildResponse(StatusCodes.OK, 
            await prisma.ranch.findUnique({ where:{ id: +req.params.id}})
            
            )
    )
}


export const deleteRanchById = async(req: Request, res: Response, next:NextFunction)=>{


    evaluateValidationResult(req, next)

    try{

        await prisma.ranch.delete({where:{ id: +req.params.id } })

    }catch(e){


    }

    res.status(StatusCodes.OK)
    return res.json( buildResponse(StatusCodes.OK) )

}



export const createRanch = async (req:Request, res: Response, next: NextFunction)=>{


    // evaluateValidationResult(req, next)

    const result = validationResult(req)
    
    if(!result.isEmpty()){
        const transformed = toMyValidation( result.array() as FieldValidationError[] )
        
    
        return next(
            new AppError("Please check your request", StatusCodes.BAD_REQUEST, transformed )
        )
        
        
        console.log("after return next")
    }

    const createdRanch  = await prisma.ranch.create({data :{ name: req.body.name}})

    res.status(StatusCodes.CREATED)
    return res.json(

        
            buildResponse(StatusCodes.CREATED, createdRanch)

    )

}





export const updateRanch = async (req:Request, res: Response, next: NextFunction)=>{


    // evaluateValidationResult(req, next)

    const result = validationResult(req)
    
    if(!result.isEmpty()){
        const transformed = toMyValidation( result.array() as FieldValidationError[] )
        
    
        return next(
            new AppError("Please check your request", StatusCodes.BAD_REQUEST, transformed )
        )
        
    }


    


    //TODO verify the record exist
    const updatedRanch =  await prisma.ranch.update({
        where:{  id : +req.params.id },
        
        data:{

            name: req.body.name
        }

    })

    // const createdRanch  = await prisma.ranch.create({data :{ name: req.body.name}})

    res.status(StatusCodes.OK)
    return res.json(

        
            buildResponse(StatusCodes.CREATED, updatedRanch)

    )

}