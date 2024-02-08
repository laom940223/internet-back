import { FieldValidationError, ValidationError } from "express-validator"



export type MyValidationError = {

    field: string
    message: string
}


export function toMyValidation(validatorErrors: FieldValidationError[] ): MyValidationError[]{

        

    return validatorErrors.map(err=>{

        return {
            
            field:err.path,
            message: err.msg 
        } 
            
    })

}

