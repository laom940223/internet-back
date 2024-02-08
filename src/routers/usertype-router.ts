import { Router } from "express";
import { createUserType, deleteUserTypeById, getAllUserTypes, getUserTypeById } from "../handlers/userTypeHandler";
import { body } from "express-validator";



export const userTypeRouter = Router()

    userTypeRouter.get("/", getAllUserTypes)
    userTypeRouter.get("/:id", getUserTypeById)
    userTypeRouter.delete("/:id", deleteUserTypeById)
    userTypeRouter.post("/", 
        [
            body("name").notEmpty().withMessage("This field is required").trim()
        ]
    ,createUserType)