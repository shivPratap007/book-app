import { NextFunction, Request, Response } from "express"
import createHttpError from "http-errors"
import cloudinary from "../config/cloudinary"
import path from "node:path"
import { BookInterface, bookModel } from "../models/bookModel"
import fs from "node:fs"
import { deleteFiles } from "../utils/deleteFiles"
import { AuthRequest } from "../middleware/authenticate"

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as Record<string, Express.Multer.File[]>
        const bookData = <BookInterface>req.body

        // EXTRACTING THE DETAILS FOR THE COVERIMAGE
        const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1)
        const filename = files.coverImage[0].filename
        const filePath = path.resolve(__dirname, "../../public/data/uploads", filename)
        // UPLOADING THE COVER IMAGE IN CLOUDINARY
        const uploadCoverImageResult = await cloudinary.uploader.upload(filePath, {
            filename_override: filename,
            folder: "bookcover",
            format: coverImageMimeType,
        })

        // EXTRACTING THE DETAILS FOR THE PDF
        const bookFileMimeType = files.file[0].mimetype.split("/").at(-1)
        const bookFileName = files.file[0].filename
        const bookFilePath = path.resolve(__dirname, "../../public/data/uploads", bookFileName)

        // UPLOADING THE PDF IN CLOUDINARY
        const uploadPdfResult = await cloudinary.uploader.upload(bookFilePath, {
            // TO UPLOAD PDF WE HAVE TO WRITE THIS
            resource_type: "raw",
            filename_override: bookFileName,
            folder: "book-pdf",
            format: bookFileMimeType,
        })

        
        // IMPORTANT
        const _req=req as AuthRequest;
        // SAVING THE DATA INTO THE DATABASE
        const newBook = await bookModel.create({
            title: bookData.title,
            genre: bookData.genre,
            author: _req.userId,
            coverImage: "1234",
            file: "1234",
        })

        // FUNCTIONS TO DELETE THE FILES FROM LOCALLY IN SERVER SERVER
        await deleteFiles(filePath, next)
        await deleteFiles(bookFilePath, next)

        return res.status(201).json({
            id: newBook._id,
        })
    } catch (error: any) {
        console.log(error)
        next(createHttpError(500, error.message))
    }
}
