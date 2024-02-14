import { Router } from "express";
import { createUserType, deleteUserTypeById, getAllUserTypes, getUserTypeById } from "../handlers/userTypeHandler";
import { body } from "express-validator";



export const userRole = Router()

    userRole.get("/", getAllUserTypes)
    userRole.get("/:id", getUserTypeById)
    userRole.delete("/:id", deleteUserTypeById)
    userRole.post("/", 
        [
            body("name").notEmpty().withMessage("This field is required").trim()
        ]
    ,createUserType)