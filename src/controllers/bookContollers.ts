import { NextFunction,Request,Response } from "express";
import createHttpError from "http-errors";


export const createBook=async (req:Request,res:Response,next:NextFunction)=>{
    try{
        return res.json({
            message:"ok",
        })
    }catch(error){
        console.log(error);
        next(createHttpError())
    }
}