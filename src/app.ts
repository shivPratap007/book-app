import express from "express"
import { Request, Response, NextFunction } from "express"
import createHttpError, { HttpError } from "http-errors"
import { config } from "./config/config"

export const app = express()

// ROUTES

app.get("/", (req: Request, res: Response, next: NextFunction) => {

    const error=createHttpError(400,"Something went wrong");
    throw error;
    return res.json({ message: "hello" })
})

// GLOBAL ERROR HANDLER
// IT WILL ALWAYS BE AT LAST
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.status

    return res.status(statusCode).json({
        status: err.status,
        message: err.message,
        errorStack: config.env === "development" ? err.stack : "",
    })
})
