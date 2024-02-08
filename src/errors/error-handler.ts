import { NextFunction, Request, Response } from "express"
import { AppError } from "./AppError"
import { ReasonPhrases } from "http-status-codes"
import { ServerResponse } from "../utils/server-response"


export const errorHandler= (err: Error, req:Request, res:Response, next:NextFunction)=>{


    if (err instanceof AppError){

        res.status(err.statusCode)

        console.log(err)

        return res.json({

            
            data: null,
            error:{
                message: err.message,
                validationErrors: err.validationErrors,
                stack: process.env.NODE_ENV ==="DEV" ? err.stack : "Stack =P" 
                
            }
        } as ServerResponse<unknown>)


    }

    return res.send("This is the error handler")
}