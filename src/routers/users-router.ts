import { Router } from "express";
import { createUser, deleteUserById, getAllUsers, getUserById, updateUser } from "../handlers/usersHandler";
import { body, param } from "express-validator";



export const usersRouter = Router()


    usersRouter.get("/", getAllUsers)
    usersRouter.get("/:id",
    [
        param("id").isNumeric()
    ]
    ,getUserById),

    usersRouter.delete("/:id",
    [
        param("id").isNumeric().withMessage("Id must be a number")
    ]
    ,deleteUserById)

    usersRouter.post("/",
            [
                
                    body("email")
                        .isEmail().withMessage("Please provide a valid email").trim(),
                    body("name").notEmpty().withMessage("This field is required").trim(),
                    body("lastName").notEmpty().trim(),
                    body("password").notEmpty().withMessage("Please provide a  password").trim(),
                    body("confirmedPassword").notEmpty().trim(),
                    body("userRoleId").notEmpty().isNumeric().withMessage("This needs to be a number").trim()
                
                 
                
            ]
    
            ,createUser)




        usersRouter.put("/:id",
            [
                
                    body("email")
                        .isEmail().withMessage("Please provide a valid email").trim(),
                    body("name").notEmpty().withMessage("This field is required").trim(),
                    body("lastName").notEmpty().trim(),
                    body("password").optional().trim(),
                    body("confirmedPassword").optional().trim(),
                    body("userRoleId").notEmpty().isNumeric().withMessage("This needs to be a number").trim(),
                    
                
                 
                
            ]
    
            ,updateUser)