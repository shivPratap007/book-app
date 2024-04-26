import { NextFunction, Request, Response } from "express"
import createHttpError from "http-errors"
import jwt from "jsonwebtoken"
import { config } from "../config/config"

export interface AuthRequest extends Request {
    userId: string
}
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) {
            return next(createHttpError(400, "Please send the token"))
        }
        const decodedToken = jwt.verify(token, config.jwt_secret as string)

        // CHANGING THE REQUEST
        const _req = req as AuthRequest
        _req.userId = decodedToken.sub as string
        next()
    } catch (error: any) {
        console.log(error)
        return next(createHttpError(500, error.message))
    }
}
