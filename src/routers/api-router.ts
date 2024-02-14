import { NextFunction, Request, Response, Router } from "express";
import { AppError } from "../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { usersRouter } from "./users-router";
import { userRole } from "./user-roles-router";
import { param } from "express-validator";
import { ranchRouter } from "./ranch-router";
import { internetPackagesRouter } from "./internet-packages-router";
import { serviceRouter } from "./service-router";
import { paymentsRouter } from "./payment-router";


export const apiRouter =  Router()


apiRouter.use("/users", usersRouter)
apiRouter.use("/user-roles", userRole)
apiRouter.use("/ranchs", ranchRouter)
apiRouter.use("/internet-packages", internetPackagesRouter)
apiRouter.use("/services", serviceRouter)
apiRouter.use("/payments", paymentsRouter)


apiRouter.get("/", (req:Request, res: Response, next:NextFunction)=>{
  
    // return next(new AppError("This is my custon error", StatusCodes.BAD_REQUEST))

    return res.send("Hello world")
})