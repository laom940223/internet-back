import { MyValidationError } from "./ValidationError"


export class AppError extends Error  {

    statusCode = 500
    validationErrors : MyValidationError[] 

    constructor(message:string, statusCode: number, validationErrors?: MyValidationError[]){

        super(message)
        this.statusCode =statusCode
        this.validationErrors = validationErrors || []
    }

}