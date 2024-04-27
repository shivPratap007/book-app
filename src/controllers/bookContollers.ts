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
import { cloudinaryLinkToDeleteFiles } from "../utils/cloudinaryLinkToDeleteFiles"
import { userModel } from "../models/userModel"

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
            description:bookData.description,
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

export const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allBooks = await bookModel.find({}).populate("author","name");
        console.log(allBooks);
        if (!allBooks) {
            return next(createHttpError(500, "No book found"))
        }
        return res.json({
            allBooks,
        })
    } catch (error: any) {
        console.log(error)
        return next(createHttpError(400, error.message))
    }
}

export const getOneBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookId = req.params.bookID
        if (!bookId) {
            return next(createHttpError(500, "No book found"))
        }
        const result = await bookModel.findById(bookId)
        if (!result) {
            return next(createHttpError(500, "No book found"))
        }
        return res.json({
            result,
        })
    } catch (error: any) {
        console.log(error)
        return next(createHttpError(400, error.message))
    }
}

export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookId = req.params.bookID
        if (!bookId) {
            return next(createHttpError(500, "No book found"))
        }
        // GETTING THE AUTHOR ID FROM BOOK
        const book = await bookModel.findById(bookId)
        const author = book?.author

        // GETTING LOGIN USER ID
        const _req = req as AuthRequest
        const loginUserId = _req.userId

        // CHECK ID BOTH OF THEM ARE EQUAL OR NOT
        if (author && author.toString() !== loginUserId) {
            return next(createHttpError(400, "Not authorized to delete the file"))
        }

        // const coverFileSplits = book?.coverImage.split("/")
        // const coverImagePublicId = coverFileSplits?.at(-2) + "/" + coverFileSplits?.at(-1)?.split(".").at(-2);

        // GENERATE THE PUBLIC ID OF THE CLOUDINARY
        const coverImagePublicId = cloudinaryLinkToDeleteFiles(book?.coverImage, next) || ""
        const filesPublicId = cloudinaryLinkToDeleteFiles(book?.file, next) || ""

        const coverImageResult = await cloudinary.uploader.destroy(coverImagePublicId)
        if (!coverImageResult) {
            return next(createHttpError(500, "Not able to delete the file form cloud"))
        }

        const fileResult = await cloudinary.uploader.destroy(filesPublicId)
        if (!fileResult) {
            return next(createHttpError(500, "Not able to delete the file form cloud"))
        }

        const result = await bookModel.deleteOne({ _id: bookId })
        if (!result) {
            return next(createHttpError(500, "No book found"))
        }
        return res.json({
            result,
        })
    } catch (error: any) {
        console.log(error)
        return next(createHttpError(400, error.message))
    }
}
