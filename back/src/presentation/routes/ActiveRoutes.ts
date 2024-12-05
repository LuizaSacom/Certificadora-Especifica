import express from "express";
import { register } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/AuthMiddleware";

export const activeRoutes = express.Router();

activeRoutes.use(authMiddleware);

activeRoutes.post("/", register);

// activeRoutes.delete("/:id", register);

// activeRoutes.get("/summary", register);

// activeRoutes.get("/:id/history", register);
