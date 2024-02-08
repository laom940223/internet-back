import { NextFunction, Request } from "express"
import { FieldValidationError, validationResult } from "express-validator"
import { toMyValidation } from "../errors/ValidationError"
import { StatusCodes } from "http-status-codes"
import { AppError } from "../errors/AppError"


export const evaluateValidationResult = (req: Request, next:NextFunction)=>{

    const result = validationResult(req)
    
    if(!result.isEmpty()){
        const transformed = toMyValidation( result.array() as FieldValidationError[] )
        return next(
            new AppError("Please check your request", StatusCodes.BAD_REQUEST, transformed )
        )        
    }

}