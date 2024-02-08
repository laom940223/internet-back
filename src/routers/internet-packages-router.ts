import { Router } from "express";
import { createInternetPackages, getAllInternetPackages } from "../handlers/internetPackagesHandler";
import { body } from "express-validator";




export const internetPackagesRouter = Router()



    internetPackagesRouter.get("/", getAllInternetPackages)
    internetPackagesRouter.post("/",
        [
            body("name").notEmpty().withMessage("The name is required"),
            body("description").notEmpty().withMessage("The description is required").trim(),
            body("price").notEmpty().isFloat({gt:0 }).withMessage("This field must be a number and greater than 0")
        ]
    
    ,createInternetPackages)