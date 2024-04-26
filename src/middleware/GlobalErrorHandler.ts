import { Request, Response, NextFunction } from "express"
import createHttpError, { HttpError } from "http-errors"
import { config } from "../config/config"

export const GlobalErrorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.status

    return res.status(statusCode).json({
        status: err.status,
        message: err.message,
        errorStack: config.env === "development" ? err.stack : "",
    })
}
