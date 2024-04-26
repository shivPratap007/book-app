import { Request, Response, NextFunction } from "express"
import createHttpError from "http-errors"
import { userModel } from "../models/userModel"
import bcrypt from "bcrypt"
import { hashThePassword } from "../utils/passwordHashing"
import { sign } from "jsonwebtoken"
import { config } from "../config/config"
import { generate_jwt } from "../utils/generateJWT"
import { comparePassword } from "../utils/comparePassword"

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            const error = createHttpError("400", "All fields are required")
            return next(error)
        }

        const user = await userModel.findOne({ email })
        if (user) {
            const error = createHttpError(400, "User already exist with this email")
            return next(error)
        }

        const hashedPassword = await hashThePassword(password,next)

        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
        })

        const token = generate_jwt(newUser._id,next)

        return res.status(201).json({
            accessToken: token,
        })
    } catch (error:any) {
        console.log(error);
        return next(createHttpError(400,error.message))
    }
}



export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, password } = req.body
        if (!email || !password) {
            const error = createHttpError("400", "All fields are required")
            return next(error)
        }

        const user = await userModel.findOne({ email })
        if (!user) {
            const error = createHttpError(404, "User not found")
            return next(error)
        }

        const isMatch=await comparePassword(password,user.password,next);


        if(!isMatch){
            return next(createHttpError(400,"Username or password incorrect"))
        }

        const token=generate_jwt(user._id,next)

        
        return res.status(200).json({
            accessToken:token,
        })
    } catch (error:any) {
        console.log(error);
        return next(createHttpError(400,error.message))
    }
}


