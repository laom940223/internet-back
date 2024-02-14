import { NextFunction, Request, Response } from "express"
import { prisma } from ".."
import { buildResponse } from "../utils/server-response"
import { StatusCodes } from "http-status-codes"



export const getMehandler= async (req: Request, res: Response, next: NextFunction)=>{

    const { userId } = req.body

    const user = await prisma.user.findUnique({ where:{ 
        id:userId
    },
    include:{
        
        userType:true
    }

    })


    return res.json(

        buildResponse(StatusCodes.OK, user)
    )


    
}