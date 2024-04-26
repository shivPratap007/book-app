import { NextFunction, Request, Response } from "express"
import createHttpError from "http-errors"
import cloudinary from "../config/cloudinary"
import path from "node:path"

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as Record<string, Express.Multer.File[]>
        console.log(files);

        const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1)
        const filename = files.coverImage[0].filename
        const filePath = path.resolve(__dirname, "../../public/data/uploads", filename)

        const uploadResult = await cloudinary.uploader.upload(filePath, {
            filename_override: filename,
            folder: "bookcover",
            format: coverImageMimeType,
        })

        console.log(uploadResult)

        const bookFileMimeType = files.file[0].mimetype.split("/").at(-1)
        const bookFileName = files.file[0].filename;
        const bookFilePath = path.resolve(__dirname, "../../public/data/uploads", bookFileName)

        const uploadPdfResult = await cloudinary.uploader.upload(bookFilePath, {
            // TO UPLOAD PDF WE HAVE TO WRITE THIS
            resource_type: "raw",
            filename_override: bookFileName,
            folder: "book-pdf",
            format: bookFileMimeType,
        })

        console.log("============================================",uploadPdfResult)

        return res.json({
            message: "ok",
        })
    } catch (error:any) {
        console.log(error)
        next(createHttpError(500,error.message))
    }
}
