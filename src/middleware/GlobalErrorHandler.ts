import { Request, Response, NextFunction } from "express"
import createHttpError, { HttpError } from "http-errors"
import { config } from "../config/config"

export const GlobalErrorHandler = (error: HttpError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.status
    

    return res.status(statusCode).json({
        status: error.status,
        message: error.message,
        errorStack: config.env === "development" ? error.stack : "",
    })
}
