import express from "express";
import { register } from "../controllers/UserController";

export const userRoutes = express.Router();

userRoutes.post("/", register);
