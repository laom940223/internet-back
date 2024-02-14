import { NextFunction, Request, Response } from "express";
import { prisma } from "..";
import { buildResponse } from "../utils/server-response";
import { StatusCodes } from "http-status-codes";
import { FieldValidationError, validationResult } from "express-validator";
import { MyValidationError, toMyValidation } from "../errors/ValidationError";
import { AppError } from "../errors/AppError";
import { hashPassword } from "../utils/password-hashing";
import { evaluateValidationResult } from "../utils/validation-result";



export const getAllUsers = async (req:Request, res:Response, next: NextFunction)=>{

    const users = await prisma.user.findMany({ include:{userType:true}})

    const noPassword = users.map(user=>{

        return {
            ...user,
            password:""
        }
    })

    res.status(StatusCodes.OK)
    return res.json( buildResponse(StatusCodes.OK, noPassword) )

}

export const getUserById = async (req:Request, res: Response, next:NextFunction)=>{


    evaluateValidationResult(req, next)
    const  { id } = req.params

    const user = await prisma.user.findUnique({ where:{ id: +id}})

    res.status(StatusCodes.OK)
    return res.json(

        buildResponse(StatusCodes.OK, { ...user, password: null })
    )

}


export const deleteUserById = async (req: Request, res: Response, next: NextFunction)=>{


    
    const result = validationResult(req)
    
    if(!result.isEmpty()){
        const transformed = toMyValidation( result.array() as FieldValidationError[] )
        return next(
            new AppError("Please check your request", StatusCodes.BAD_REQUEST, transformed )
        )
    }

    try {
        await prisma.user.delete({ where:{ id: +req.params.id}})
    } catch (error) {
        
        console.log(error)

        return next(new AppError("Something went wrong",StatusCodes.INTERNAL_SERVER_ERROR))
    }


    res.status(StatusCodes.OK)
    return res.json()
}



export const createUser = async (req:Request, res: Response, next: NextFunction)=>{

    evaluateValidationResult(req, next)

    if( req.body.password !== req.body.confirmedPassword){

        return next(new AppError("Invalid password", StatusCodes.BAD_REQUEST, [{ field:"confirmedPassword", message:"Password must match"  }]))
    }
    
    
    if( await prisma.user.findUnique({where:{  email:req.body.email }})){

        return next(new AppError("Email already in use", StatusCodes.BAD_REQUEST, [{ field:"email", message:"Email already in use"  }]))

    }


    const userType = await prisma.userType.findUnique({ where:{ id: +req.body.usertypeId}})


    if(!userType){

        return next(new AppError("Invalid user type", StatusCodes.BAD_REQUEST, [{ field:"usertypeId", message:"The user type is not valid" }]))
    }

    const { password, email, name, lastName  } = req.body


    const hashedPassword =  await hashPassword(password)



    const createdUser = await prisma.user.create({
        data:{
            
            email,
            name,
            lastName,
            password: hashedPassword!,
            userTypeId: userType.id
        }
})

    return res.json(
        buildResponse(StatusCodes.CREATED,{
            ...createdUser,
            password:null
        })
    )
}






export const updateUser = async (req:Request, res: Response, next: NextFunction)=>{


    console.log("updating user")
    evaluateValidationResult(req, next)

    const isThereAPassword = !!req.body.password && !!req.body.confirmedPassword

    if(  isThereAPassword &&  req.body.password !== req.body.confirmedPassword){

        return next(new AppError("Invalid password", StatusCodes.BAD_REQUEST, [{ field:"confirmedPassword", message:"Password must match"  }]))
    }
    
    
    const toUpdate = await prisma.user.findUnique({where:{  id: +req.params.id! }})

    if(!toUpdate ){

        return next(new AppError("Not user found", StatusCodes.NOT_FOUND, [{ field:"id", message:"The user was not found"  }]))

    }



    console.log(req.body.email !== toUpdate.email)

    if( 
        req.body.email !== toUpdate.email &&
        !!await prisma.user.findUnique({ where:{ email: req.body.email } })
    
        ){

            return next(new AppError("Email already in use", StatusCodes.BAD_REQUEST, [{ field:"email", message:"Email already in use"  }]))
        }

    


    const userType = await prisma.userType.findUnique({ where:{ id: +req.body.usertypeId}})


    if(!userType){

        return next(new AppError("Invalid user type", StatusCodes.BAD_REQUEST, [{ field:"usertypeId", message:"The user type is not valid" }]))
    }

    const { password, email, name, lastName  } = req.body



    let hashedPassword : string | null = ""
    
    if(isThereAPassword){

        try{
            
            hashedPassword =   await hashPassword(password)

        }catch(err){
            return next(new AppError("Something went wrong", StatusCodes.INTERNAL_SERVER_ERROR))
        }
            


    }

    



    const createdUser = await prisma.user.update({

        where:{
            id: +req.params.id
        },

        data:{
            
            email,
            name,
            lastName,
            password: isThereAPassword ? hashedPassword! : toUpdate.password ,
            userTypeId: userType.id
        }
})

    return res.json(
        buildResponse(StatusCodes.OK,{
            ...createdUser,
            password:null
        })
    )
}