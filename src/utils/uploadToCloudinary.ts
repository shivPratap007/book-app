import { NextFunction } from "express"
import createHttpError from "http-errors"
import cloudinary from "../config/cloudinary"
import path from "node:path"
import { deleteFiles } from "../utils/deleteFiles"
import { UploadApiResponse } from "cloudinary"

export const uploadToCloudinary = async (uploadFile: any, next: NextFunction) => {
    try {
        // EXTRACTING THE DETAILS FOR THE UPLOAD
        const coverImageMimeType = uploadFile.mimetype.split("/").at(-1)
        const filename = uploadFile.filename
        const filePath = path.resolve(__dirname, "../../public/data/uploads", filename)
        // UPLOADING THE DATA IN CLOUDINARY
        const uploadedResults: UploadApiResponse = await cloudinary.uploader.upload(filePath, {
            filename_override: filename,
            folder: "bookcover",
            format: coverImageMimeType,
        })

        if (uploadedResults) {
            await deleteFiles(filePath, next)
        }
        return uploadedResults
    } catch (error: any) {
        console.log(error)
        return next(createHttpError(500, error.message))
    }
}
