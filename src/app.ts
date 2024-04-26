import express from "express"
import { Request, Response, NextFunction, Application } from "express"
import createHttpError, { HttpError } from "http-errors"
import { config } from "./config/config"
import { GlobalErrorHandler } from "./middleware/GlobalErrorHandler"

export const app = express()

// ROUTES

export const MainApp = (app: Application) => {
    app.get("/", (req: Request, res: Response, next: NextFunction) => {
        const error = createHttpError(500, "Something went wrong")
        throw error
    })




    


    // GLOBAL ERROR
    // IT WILL ALWAYS BE AT THE LAST
    app.use(GlobalErrorHandler);
}
