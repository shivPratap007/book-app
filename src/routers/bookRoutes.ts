import express from "express"
import multer from "multer"
import path from "node:path"
import { createBook, updateBook } from "../controllers/bookContollers"
import { authenticate } from "../middleware/authenticate"

const router = express.Router()

const upload = multer({
    dest: path.resolve(__dirname, "../../public/data/uploads"),
    limits: { fileSize: 10 * 1024 * 1024 },
})

router.post(
    "/",
    authenticate,
    upload.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "file", maxCount: 1 },
    ]),
    createBook
)

router.patch(
    "/:bookID",
    authenticate,
    upload.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "file", maxCount: 1 },
    ]),
    updateBook
)

export { router as BookRouter }
