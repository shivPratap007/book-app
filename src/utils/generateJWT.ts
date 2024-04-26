import { sign } from "jsonwebtoken"
import { config } from "../config/config"
import { NextFunction } from "express"
import createHttpError from "http-errors"

export const generate_jwt = (payload: string, next: NextFunction) => {
    try {
        return sign({ sub: payload }, config.jwt_secret as string, { expiresIn: "7d" })
    } catch (error: any) {
        next(createHttpError(400, error.message))
    }
}
