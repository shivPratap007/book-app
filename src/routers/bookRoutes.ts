import express from "express"
import { createUser, loginUser } from "../controllers/userController"
import { createBook } from "../controllers/bookContollers"

const router = express.Router()

router.post("/", createBook)

export { router as BookRouter }
