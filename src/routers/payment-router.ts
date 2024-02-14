import { Router } from "express";
import { getAllPayments, getAllServicePaymnents, makeServicePayment } from "../handlers/paymentsHandler";
import { body } from "express-validator";





export const paymentsRouter = Router()



    paymentsRouter.get("/", getAllPayments)
    paymentsRouter.get("/:serviceId", getAllServicePaymnents)



    paymentsRouter.post("/:id/pay",
        [
            
            body("monthlyPayment").isISO8601().withMessage("Please provide a valid date"),
            body("description").isString().optional()

        ]

    ,makeServicePayment)