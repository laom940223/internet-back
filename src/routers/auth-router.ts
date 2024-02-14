import { Router } from "express";
import { forgotPasswordHandler, getMehandler, logInHandler, logOutHandler, recoverPassword } from "../handlers/authHandler";
import { body, param } from "express-validator";



export const authRouter = Router()



    authRouter.get("/me", getMehandler)

    authRouter.post("/forgot-password",
        [
            body("email").notEmpty().withMessage("Please provide an email")
        ]
    ,forgotPasswordHandler)


    authRouter.post("/recover-password/:token", 
        [
            param("token").notEmpty().withMessage("Please provide a token"),
            body("password").notEmpty().withMessage("Please provide a password"),
            body("confirmedPassword").notEmpty().withMessage("Please provide a confirm password")
        ]
    
    ,recoverPassword)




    authRouter.post("/logout", logOutHandler)
    authRouter.post("/login",
        [
            body("email").notEmpty().withMessage("The email is required"),
            body("password").notEmpty().withMessage("Password is required")
        ]
    ,logInHandler)


