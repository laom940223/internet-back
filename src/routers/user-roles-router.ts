import { Router } from "express";
import { createUserRole, deleteUserRoleById, getAllUserRoles, getUserRoleById } from "../handlers/userRoleHandler";
import { body } from "express-validator";



export const userRole = Router()

    userRole.get("/", getAllUserRoles)
    userRole.get("/:id", getUserRoleById)
    userRole.delete("/:id", deleteUserRoleById)
    userRole.post("/", 
        [
            body("name").notEmpty().withMessage("This field is required").trim()
        ]
    ,createUserRole)