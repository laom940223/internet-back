import { ValidationError } from "./ValidationError"


export class AppError extends Error  {

    statusCode = 500
    validationErrors : ValidationError[]  =[]

    constructor(message:string, statusCode: number, validationErrors?: ValidationError){

        super(message)
        this.statusCode =statusCode
        this.validationErrors
    }

}