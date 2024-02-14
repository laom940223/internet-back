import { Router } from "express";
import { createService, deleteServiceById, getAllServices, getServiceById, updateServiceById } from "../handlers/servicesHandlers";
import { body } from "express-validator";
import { version } from "os";
import { ServiceStatus } from "@prisma/client";





export const serviceRouter = Router()



    serviceRouter.get("/", getAllServices)
    serviceRouter.get("/:id", getServiceById)
    serviceRouter.delete("/:id", deleteServiceById)
    serviceRouter.post("/",
    
        [
            
            body("name").notEmpty().withMessage("Name is required"),
            body("lastName").notEmpty().withMessage("Last name is required"),
            body("phone").notEmpty().withMessage("Phone is required").isMobilePhone("es-MX"),
            
            body("latitude").isFloat({ min:-90, max:90 }).withMessage("Must be between -90 and 90"),
            body("longitude").isFloat({ min: -180, max:180 }).withMessage("Must be bewteen -180 and 180"),
            body("packageId").notEmpty().isInt({ gt:0}),
            body("ranchId").notEmpty().isInt({ gt:0}),
            body("paymentDay").isInt({ min:0, max: 31 }).withMessage("Must be between 1 and 31").optional(),
            
            body("serviceStatus")
            .custom((value) => {
                if (!Object.values(ServiceStatus).includes(value)) {
                throw new Error('Invalid service status');
                }
                return true;
            })
        ]
    ,createService)


    serviceRouter.put("/:id",
    
        [
            
            body("name").notEmpty().withMessage("Name is required"),
            body("lastName").notEmpty().withMessage("Last name is required"),
            body("phone").notEmpty().withMessage("Phone is required").isMobilePhone("es-MX"),
            
            body("latitude").isFloat({ min:-90, max:90 }).withMessage("Must be between -90 and 90"),
            body("longitude").isFloat({ min: -180, max:180 }).withMessage("Must be bewteen -180 and 180"),
            body("packageId").notEmpty().isInt({ gt:0}),
            body("ranchId").notEmpty().isInt({ gt:0}),
            body("paymentDay").isInt({ min:0, max: 31 }).withMessage("Must be between 1 and 31").optional(),



            body("serviceStatus")
            .custom((value) => {
                if (!Object.values(ServiceStatus).includes(value)) {
                throw new Error('Invalid service status');
                }
                return true;
            })
            // body("userId").optional().isNumeric().withMessage("The id must be a number"),
            // body("stripeContract").optional()
        ]
    ,updateServiceById)