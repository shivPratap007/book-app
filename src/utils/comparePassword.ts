import { NextFunction } from "express";
import createHttpError from "http-errors";
import bcrypt from 'bcrypt'


export const comparePassword=async(oldPassword:string,newPassword:string,next:NextFunction)=>{
    try{
        return await bcrypt.compare(oldPassword,newPassword);
    }catch(error:any){
        console.log(error);
        next(createHttpError(404,error.message));
    }
}