import bcrypt from "bcrypt"
import createHttpError from "http-errors"
import { NextFunction } from "express"
export const hashThePassword = async (password: string,next:NextFunction) => {
    try {
        return await bcrypt.hash(password, 10)
    } catch (error: any) {
        next(createHttpError(400, error.message))
    }
}
