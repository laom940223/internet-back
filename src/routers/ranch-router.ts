import { Router } from "express";
import { createRanch, deleteRanchById, getAllRanchs, getRanchById, updateRanch } from "../handlers/ranchHandlers";
import { body, param } from "express-validator";



export const ranchRouter = Router()


    ranchRouter.get("/", getAllRanchs)
    ranchRouter.get("/:id",
        [
            param("id").notEmpty().isNumeric().withMessage("Id must be a number")
        ]
        ,getRanchById)

    ranchRouter.delete("/:id",
        [
            param("id").notEmpty().isNumeric().withMessage("Id must be a number")
        ]
        ,deleteRanchById)


    ranchRouter.post("/",
        [
            body("name").notEmpty().withMessage("The name is required")

        ]
    
        ,createRanch)


    ranchRouter.put("/:id",
        [
            param("id").isInt().withMessage("Provide a valid id"),
            body("name").notEmpty()
        ]
        
        ,updateRanch)