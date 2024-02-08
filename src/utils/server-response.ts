import { Response } from "express";
import { AppError } from "../errors/AppError";
import { StatusCodes } from "http-status-codes";


export interface ServerResponse<T> {

    statusCode: number
    data?: T,
    error?: AppError
    
}


export const buildResponse =<T> (statusCode: StatusCodes, data?: T, error?: AppError)=>{


    return {
        statusCode: statusCode,
        data:data || null,
        error: error || null
    } as ServerResponse<T>

}