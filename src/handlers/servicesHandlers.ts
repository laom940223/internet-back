import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { buildResponse } from "../utils/server-response";
import { prisma } from "..";
import { evaluateValidationResult } from "../utils/validation-result";
import { AppError } from "../errors/AppError";
import { FieldValidationError, validationResult } from "express-validator";
import { toMyValidation } from "../errors/ValidationError";


var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;


export const getAllServices = async (req: Request, res: Response, next: NextFunction)=>{

    res.status(StatusCodes.OK)

    return res.json(

        buildResponse(StatusCodes.OK, await prisma.service.findMany())
    )

}


export const deleteServiceById = async(req: Request, res: Response, next: NextFunction)=>{


    const { id  } = req.params

    await prisma.service.delete({ where:{ id } })

    res.status(StatusCodes.OK)
    return res.json(buildResponse(StatusCodes.OK))

}

export const getServiceById = async(req:Request, res: Response, next: NextFunction)=>{

    const result = validationResult(req)    
    if(!result.isEmpty()){
        const transformed = toMyValidation( result.array() as FieldValidationError[] )
        return next(
            new AppError("Please check your request", StatusCodes.BAD_REQUEST, transformed )
        )
    }


    const service = await prisma.service.findUnique({where:{
        id: req.params.id
    }})


    res.status(StatusCodes.OK)
    return res.json(

        buildResponse(StatusCodes.OK, service)
    )





}




export const createService = async (req: Request, res: Response, next: NextFunction)=>{


    const result = validationResult(req)
    
    if(!result.isEmpty()){
        const transformed = toMyValidation( result.array() as FieldValidationError[] )
        return next(
            new AppError("Please check your request", StatusCodes.BAD_REQUEST, transformed )
        )
    }


    if( req.body.ip ){


        if(!(req.body.ip as string).match(ipformat)){

            return next(new AppError("Bad request", StatusCodes.BAD_REQUEST, [{ field:"ip", message:"Please provide a valid ip" }]))
        }

        if(await prisma.service.findUnique({ where:{ ip: req.body.ip } })){
            return next( new AppError("Ip already in use", StatusCodes.BAD_REQUEST, [{ field:"ip", message:"IP already in use" }]) )
        }
            
    }


    const ranch = await prisma.ranch.findUnique({ where:{  id: req.body.ranchId}})

    if( !ranch ){

        return next( new AppError("Bad request", StatusCodes.BAD_REQUEST, [{ field:"ranchId", message:"The ranch you provided was not found" }]))

    }


    const ipackage = await prisma.internetPackage.findUnique({ where : { id: req.body.packageId }})
    
    if(!ipackage){

        return next( new AppError("Bad request", StatusCodes.BAD_REQUEST, [{ field:"packageId", message:"The package you provided was not found" }]))
    }



    const { name, lastName, phone, ip, latitude, longitude, paymentDay } = req.body

    const newService = await prisma.service.create({

        data:{
            name,
            lastName,
            phone , 
            latitude,
            longitude,
            ip,
            paymentDay,
            packageId: ipackage.id,
            ranchId: ranch.id
        }

    })
    

    res.status(StatusCodes.CREATED)

    return res.json(
        buildResponse(StatusCodes.CREATED, newService)

    )


}



export const updateServiceById = async (req: Request, res: Response, next: NextFunction)=>{


    const result = validationResult(req)
    
    if(!result.isEmpty()){
        const transformed = toMyValidation( result.array() as FieldValidationError[] )
        return next(
            new AppError("Please check your request", StatusCodes.BAD_REQUEST, transformed )
        )
    }


    if( req.body.ip ){


        if(!(req.body.ip as string).match(ipformat)){

            return next(new AppError("Bad request", StatusCodes.BAD_REQUEST, [{ field:"ip", message:"Please provide a valid ip" }]))
        }

        const toupdate = await prisma.service.findUnique({ where:{ ip: req.body.ip } })

        if( toupdate &&
            toupdate.id !== req.params.id

        ){
            return next( new AppError("Ip already in use", StatusCodes.BAD_REQUEST, [{ field:"ip", message:"IP already in use" }]) )
        }
            
    }


    const ranch = await prisma.ranch.findUnique({ where:{  id: req.body.ranchId}})

    if( !ranch ){
        return next( new AppError("Bad request", StatusCodes.BAD_REQUEST, [{ field:"ranchId", message:"The ranch you provided was not found" }]))
    }


    const ipackage = await prisma.internetPackage.findUnique({ where : { id: req.body.packageId }})
    
    if(!ipackage){
        return next( new AppError("Bad request", StatusCodes.BAD_REQUEST, [{ field:"packageId", message:"The package you provided was not found" }]))
    }



    const { name, lastName, phone, ip, latitude, longitude, paymentDay } = req.body
    const { id } = req.params

    const newService = await prisma.service.update({
        
        where:{ id }        
        ,

        data:{
            name,
            lastName,
            phone , 
            latitude,
            longitude,
            ip,
            paymentDay,
            packageId: ipackage.id,
            ranchId: ranch.id
        }

    })
    

    res.status(StatusCodes.OK)

    return res.json(
        buildResponse(StatusCodes.OK, newService)

    )


}