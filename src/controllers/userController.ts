import { Request, Response, NextFunction } from "express"
import createHttpError from "http-errors";

export const createUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            const error=createHttpError("400","All fields are required");
            return next(error);
        }
        return res.json({ message: "User is registered" })
    } catch (error) {
    }
}
