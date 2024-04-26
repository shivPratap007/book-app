import { Request, Response, NextFunction } from "express"
import createHttpError from "http-errors";
import { userModel } from "../models/userModel";
import bcrypt from 'bcrypt'
import { hashThePassword } from "../utils/passwordHashing";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            const error=createHttpError("400","All fields are required");
            return next(error);
        }


        const user=await userModel.findOne({email});
        if(user){
            const error=createHttpError(400,'User already exist with this email');
            return next(error);
        }

        const hashedPassword=await hashThePassword(password);



        return res.json({ message: "User is registered" })
    } catch (error) {
    }
}
