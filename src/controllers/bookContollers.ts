import { NextFunction, Request, Response } from "express"
import createHttpError from "http-errors"
import cloudinary from "../config/cloudinary"
import path from "node:path"
import { BookInterface, bookModel } from "../models/bookModel"
import fs from "node:fs"
import { deleteFiles } from "../utils/deleteFiles"
import { AuthRequest } from "../middleware/authenticate"
import { uploadToCloudinary } from "../utils/uploadToCloudinary"
import { UploadApiResponse } from "cloudinary"

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as Record<string, Express.Multer.File[]>
        const bookData = <BookInterface>req.body
        // UPLOAD COVER IMAGE
        const uploadedCoverImageResult: UploadApiResponse | void = await uploadToCloudinary(files.coverImage[0], next)
        // UPLOAD PDF
        const uploadedPdfResult: UploadApiResponse | void = await uploadToCloudinary(files.file[0], next)

        // IMPORTANT
        const _req = req as AuthRequest
        // SAVING THE DATA INTO THE DATABASE
        const newBook = await bookModel.create({
            title: bookData.title,
            genre: bookData.genre,
            author: _req.userId,
            coverImage: uploadedCoverImageResult?.secure_url,
            file: uploadedPdfResult?.secure_url,
        })

        return res.status(201).json({
            id: newBook._id,
        })
    } catch (error: any) {
        console.log(error)
        next(createHttpError(500, error.message))
    }
}
interface UpdateBook {
    title: string
    genre: string
}
export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as Record<string, Express.Multer.File[]>
        const bookId = req.params.bookID
        if (!bookId) {
            return next(createHttpError(400, "Please provide the book id"))
        }
        const bookData: UpdateBook = req.body
        console.log(bookData)
        if (!bookData) {
            return next(createHttpError(400, "Please provide the details of the book"))
        }

        // CHECK WHETHER ANY BOOK EXIST WITH THIS ID
        const findBookFromId = await bookModel.findById(bookId)
        if (!findBookFromId) {
            return next(createHttpError(404, "No book found"))
        }

        // CHECKING THE AUTHENTICATION WHETHER THIS PERSON HAVE THE RIGHTS TO DELETE THE BOOK OR NOT
        const _req = req as AuthRequest
        if (_req.userId !== findBookFromId.author.toString()) {
            return next(createHttpError(400, "User not authorized to change the book details"))
        }

        // UPLOAD COVER IMAGE
        const uploadCoverImageResult: UploadApiResponse | void = await uploadToCloudinary(files.coverImage[0], next)
        if (uploadCoverImageResult && Object.keys(uploadCoverImageResult).length === 0) {
            return next(createHttpError(500, "Not able to uplaod the file"))
        }
        // UPLOAD PDF
        const uploadedPdfResult: UploadApiResponse | void = await uploadToCloudinary(files.file[0], next)
        if (uploadedPdfResult && Object.keys(uploadedPdfResult).length === 0) {
            return next(createHttpError(500, "Not able to uplaod the file"))
        }

        const updateDetails = {
            title: bookData.title,
            genre: bookData.genre,
            coverImage: uploadCoverImageResult?.secure_url,
            file: uploadedPdfResult?.secure_url,
        }

        // UPDATING THE DATA
        const updatedResults = await bookModel.findByIdAndUpdate(bookId, updateDetails, { new: true })

        return res.status(201).json({ updatedResults })
    } catch (error: any) {
        console.log(error)
        next(createHttpError(400, error.message))
    }
}
