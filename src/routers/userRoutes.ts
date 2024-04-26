import express from "express";
import { createUser } from "../controllers/userController";

const router=express.Router();


// CREATE USER ROUTER
router.post("/register",createUser);

export {router as UserRouter};