import { Router } from "express";
import { createUser, getAllUsers } from "../handlers/usersHandler";
import { body } from "express-validator";



export const usersRouter = Router()


    usersRouter.get("/", getAllUsers)
    usersRouter.post("/",
            [
                
                    body("email")
                        .exists().withMessage("This is required")
                        .isEmail().withMessage("Please provide a valid email").trim(),
                    body("name").notEmpty().withMessage("This field is required").trim(),
                    // body("lastName").notEmpty().trim(),
                    // body("password").notEmpty().trim(),
                
                 
                
            ]
    
            ,createUser)