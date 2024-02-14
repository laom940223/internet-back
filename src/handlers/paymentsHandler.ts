import { NextFunction, Request, Response } from "express";
import { prisma } from "..";
import { StatusCodes } from "http-status-codes";
import { buildResponse } from "../utils/server-response";
import { FieldValidationError, validationResult } from "express-validator";
import { toMyValidation } from "../errors/ValidationError";
import { AppError } from "../errors/AppError";





export const getAllPayments = async (req: Request, res: Response, next: NextFunction)=>{

    const payments = await prisma.payment.findMany()
    res.status(StatusCodes.OK)
    return res.json(
        buildResponse(StatusCodes.OK, payments)
    )
}



export const getAllServicePaymnents = async (req: Request, res: Response, next: NextFunction)=>{

    const { serviceId} = req.params


    const payments = await prisma.payment.findMany({ where:{ serviceId}, orderBy:{createdAt:"desc"} })


    res.status(StatusCodes.OK)
    return res.json(

        buildResponse(StatusCodes.OK,
            payments
            )
    )


}



export const makeServicePayment = async(req: Request, res: Response, next: NextFunction)=>{


    

    const result = validationResult(req)
    
    if(!result.isEmpty()){
        const transformed = toMyValidation( result.array() as FieldValidationError[] )
        return next(
            new AppError("Please check your request", StatusCodes.BAD_REQUEST, transformed )
        )
    }

    const { id } = req.params
    const service =  await prisma.service.findUnique({ where:{ id } , include: { package:true} })


    if(!service){
        return next( new AppError("Check request", StatusCodes.BAD_REQUEST, [{ field:"serviceId", message:"Please provide a valid service id" }]))
    }

    // console.log(+req.body.amount, service.package.price)

    


    const { description, monthlyPayment} = req.body

    const newPayment =  await prisma.payment.create({ 
        data:{
            amount: service.package.price,
            description,
            serviceId: service.id,
            monthlyPayment,
        }
    })

    return res.json(
        buildResponse(StatusCodes.OK, newPayment)
    )

}