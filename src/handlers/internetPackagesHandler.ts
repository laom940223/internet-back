import { NextFunction, Request, Response } from "express"
import { prisma } from ".."
import { StatusCodes } from "http-status-codes"
import { buildResponse } from "../utils/server-response"

import { AppError } from "../errors/AppError"
import { toMyValidation } from "../errors/ValidationError"
import { FieldValidationError, validationResult } from "express-validator"




export const getAllInternetPackages = async (req: Request, res: Response, next: NextFunction)=>{

    const packages = await prisma.internetPackage.findMany()
    res.status(StatusCodes.OK)
    return res.json(buildResponse(StatusCodes.OK, packages))
}



export const deleteInternetPackageById = async (req:Request, res: Response, next: NextFunction)=>{

    const result = validationResult(req)
    
    if(!result.isEmpty()){
        const transformed = toMyValidation( result.array() as FieldValidationError[] )
        
        // console.log("inside there is some error")
        return next(
            new AppError("Please check your request", StatusCodes.BAD_REQUEST, transformed )
        )
        
    }


    try {
        await prisma.internetPackage.delete({ where:{ id: +req.params.id} })
    } catch (err) {
        console.log(err)
    }


    res.status(StatusCodes.OK)
    return res.json(buildResponse(StatusCodes.OK))
 

}




export const createInternetPackages = async (req:Request, res: Response, next: NextFunction)=>{


    // evaluateValidationResult(req, next)
    

    const result = validationResult(req)
    
    if(!result.isEmpty()){
        const transformed = toMyValidation( result.array() as FieldValidationError[] )
        
        console.log("inside there is some error")
        return next(
            new AppError("Please check your request", StatusCodes.BAD_REQUEST, transformed )
        )
        
    }

    const { name, description, price } = req.body


    const internetpackage = await prisma.internetPackage.create({ data:{
        name, 
        description,
        price
    } })


    res.status(StatusCodes.CREATED)

    return res.json(

        buildResponse(StatusCodes.CREATED,  internetpackage)

    )

}





export const updateInternetPackages = async (req:Request, res: Response, next: NextFunction)=>{


    // evaluateValidationResult(req, next)
    

    const result = validationResult(req)
    
    if(!result.isEmpty()){
        const transformed = toMyValidation( result.array() as FieldValidationError[] )
        
        console.log("inside there is some error")
        return next(
            new AppError("Please check your request", StatusCodes.BAD_REQUEST, transformed )
        )
        
    }

    const { name, description, price } = req.body
    const { id } = req.params

    

    const internetpackage = await prisma.internetPackage.update({ 
        where:{
            id:+id
        },
    
        data:{
            name, 
            description,
            price
        } 
    })


    res.status(StatusCodes.OK)

    return res.json(

        buildResponse(StatusCodes.OK,  internetpackage)

    )


}