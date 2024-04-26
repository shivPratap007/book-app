import express from "express"
import { Request, Response, NextFunction, Application } from "express"
import createHttpError, { HttpError } from "http-errors"
import { config } from "./config/config"
import { GlobalErrorHandler } from "./middleware/GlobalErrorHandler"
import { UserRouter } from "./routers/userRoutes"
import { BookRouter } from "./routers/bookRoutes"

// ROUTES

export const MainApp = (app: Application) => {
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.get("/", (req: Request, res: Response, next: NextFunction) => {
        // const error = createHttpError(500, "Something went wrong")
        // throw error
        console.log(req.body)
    })

    app.use("/api/users", UserRouter)

    app.use("/api/books", BookRouter)

    // GLOBAL ERROR
    // IT WILL ALWAYS BE AT THE LAST
    app.use(GlobalErrorHandler)
}
