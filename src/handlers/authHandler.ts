import { NextFunction, Request, Response } from "express"
import { prisma, transporter } from ".."
import { buildResponse } from "../utils/server-response"
import { StatusCodes } from "http-status-codes"
import { FieldValidationError, validationResult } from "express-validator"
import { toMyValidation } from "../errors/ValidationError"
import { AppError } from "../errors/AppError"
import { compare } from "bcrypt"
import { createId } from "@paralleldrive/cuid2"
import { addMinutes, isPast } from 'date-fns'
import { hashPassword } from "../utils/password-hashing"



const EXPIRATION_TIME = 2

export const getMehandler= async (req: Request, res: Response, next: NextFunction)=>{

    
    console.log(req.session)

    if( !req.session.user){
        
        res.status(StatusCodes.OK)
        return res.json(buildResponse(StatusCodes.UNAUTHORIZED))
    }

    const user = await prisma.user.findUnique({ where:{ 
        email:req.session.user.email
    },
    include:{
        
        userType:true
    }

    })

    res.status(StatusCodes.OK)
    return res.json(

        buildResponse(StatusCodes.OK, user)
    )    
}


export const logOutHandler = async(req: Request, res: Response, next: NextFunction)=>{

    req.session.destroy((err)=>{

        return next(err)
    })

    return res.json(buildResponse(StatusCodes.OK))
}


export const logInHandler = async ( req: Request, res: Response, next: NextFunction)=>{

    const result = validationResult(req)

    if(!result.isEmpty()){
        const transformed = toMyValidation( result.array() as FieldValidationError[] )
        
        console.log("inside there is some error")
        return next(
            new AppError("Please check your request", StatusCodes.BAD_REQUEST, transformed )
        )
    }


    const {email, password} = req.body

    const user =  await prisma.user.findUnique({ where:{ email} , include:{ userType:true} })

    if(!user){
        return next( new AppError("Invalid user", StatusCodes.BAD_REQUEST, [{field:"email", message:"Invalid email"}]) )
    }


    if( ! await compare(password,user.password )){

        return next(new AppError("Invalid credentials", StatusCodes.BAD_REQUEST, [{field:"password", message:"Invalid password"}]))
        
    }

    req.session.user = { email: user.email,usertype : user.userType }

    res.status(StatusCodes.OK)
    return res.json( 
        buildResponse(StatusCodes.OK)
    )


}




export const forgotPasswordHandler = async(req:Request, res: Response,  next: NextFunction)=>{

    // console.log(process.env.EMAIL_USER, process.env.EMAIL_PASSWORD)

    const result = validationResult(req)
    
    if(!result.isEmpty()){
        const transformed = toMyValidation( result.array() as FieldValidationError[] )
        
        // console.log("inside there is some error")
        return next(
            new AppError("Please check your request", StatusCodes.BAD_REQUEST, transformed )
        )
        
    }


    const { email } = req.body

    const user = await prisma.user.findUnique({ where:{ email }})
    
    if(!user) return res.status(200).json( buildResponse(StatusCodes.OK) )

    


    const today = new Date()

    const added = addMinutes( today, EXPIRATION_TIME)

    console.log(today, added)

    const token = createId()
    const passwordRecovery = await prisma.recoverPassword.create({
        data:{
            email,
            token,
            expiration: added
        }
    })


    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Recover password',
        text: '<p>Click <a href="http://localhost:3000/sessions/recover/' + token + '">here</a> to reset your password</p>'

      };
    
      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
        //   return res.status(500).send(error.toString());
        }
    
        return res.status(200).json( buildResponse(StatusCodes.OK) )
      });


}





export const recoverPassword = async (req: Request, res: Response, next: NextFunction)=>{


    const result = validationResult(req)
    
    if(!result.isEmpty()){
        const transformed = toMyValidation( result.array() as FieldValidationError[] )
        
        // console.log("inside there is some error")
        return next(
            new AppError("Please check your request", StatusCodes.BAD_REQUEST, transformed )
        )   
    }


    const { token } = req.params


    const session = await prisma.recoverPassword.findFirst({ where:{ token}})


    

    if(!session  ||  isPast( session.expiration) ){

        //TODO Delete expired tokens
        return next(new AppError("Invalid token", StatusCodes.BAD_REQUEST, [{ field:"token", message:"Invalid token" }]))
    }


    const { password, confirmedPassword } = req.body


    if(password!== confirmedPassword){
        return next(new AppError("Password", StatusCodes.BAD_REQUEST, [{ field:"confirmedPassword", message:"Password must match" }]))
    }


    const userToUpdate = await prisma.user.findFirst({  where:{  email: session.email } })

    if(!userToUpdate)  {
        return next(new AppError("Password", StatusCodes.NOT_FOUND, [{ field:"email", message:"Email was not found" }]))
    }



    try{
        const hashedPassword =  await hashPassword(password)

        const updatedUser = await prisma.user.update({ where:{ id: userToUpdate.id},
            data:{
                password: hashedPassword!
            }
        })

        await prisma.recoverPassword.delete({ where: { id:session.id } })


        return res.status(StatusCodes.OK).json( buildResponse(StatusCodes.OK))

    }catch(err){
        return next(err)
    }
        



    

}