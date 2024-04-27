import { NextFunction } from "express";
import createHttpError from "http-errors";


export const cloudinaryLinkToDeleteFiles=(book:(string|undefined),next:NextFunction)=>{
    try{
        const coverFileSplits = book?.split("/");
        const link=coverFileSplits?.at(-2) + "/" + coverFileSplits?.at(-1)?.split(".").at(-2);
        return link;
    }catch(error:any){
        console.log(error);
        return next(createHttpError(500,error.message))
    }
}