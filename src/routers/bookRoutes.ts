import express from "express"
import multer from "multer"
import path from "node:path"
import { createUser, loginUser } from "../controllers/userController"
import { createBook } from "../controllers/bookContollers"

const router = express.Router()

const upload = multer({
    dest: path.resolve(__dirname, "../../public/data/uploads"),
    limits: { fileSize: 10 * 1024 * 1024 },
})

router.post(
    "/",
    upload.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "file", maxCount: 1 },
    ]),
    createBook
)

export { router as BookRouter }
