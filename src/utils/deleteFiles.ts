import { NextFunction } from "express"
import createHttpError from "http-errors"
import fs from "node:fs"

export const deleteFiles = async (filename: string, next: NextFunction) => {
    try {
        await fs.promises.unlink(filename)
    } catch (error: any) {
        console.log(error)
        return next(createHttpError(500, error.message))
    }
}
