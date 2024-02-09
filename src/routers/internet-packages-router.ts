import { Router } from "express";
import { createInternetPackages, deleteInternetPackageById, getAllInternetPackages, updateInternetPackages } from "../handlers/internetPackagesHandler";
import { body, param } from "express-validator";




export const internetPackagesRouter = Router()



    internetPackagesRouter.get("/", getAllInternetPackages)
    internetPackagesRouter.delete("/:id",
        [
            param("id").isInt().withMessage("Please provide a valid ID")
        ]
    ,deleteInternetPackageById)
    
    internetPackagesRouter.post("/",
        [
            body("name").notEmpty().withMessage("The name is required"),
            body("description").notEmpty().withMessage("The description is required").trim(),
            body("price").isFloat({gt:0 }).withMessage("This field must be a number and greater than 0")
        ]
    ,createInternetPackages)

    

    
    internetPackagesRouter.put("/:id",
        [
            body("name").notEmpty().withMessage("The name is required"),
            body("description").notEmpty().withMessage("The description is required").trim(),
            body("price").isFloat({gt:0 }).withMessage("This field must be a number and greater than 0")
        ]
    ,updateInternetPackages)