import express from "express";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import {
  deleteActive,
  summary,
  upsertActive,
} from "../controllers/ActiveController";

export const activeRoutes = express.Router();

activeRoutes.use(authMiddleware);

activeRoutes.get("/", summary);

activeRoutes.put("/:id", upsertActive);

activeRoutes.post("/", upsertActive);

activeRoutes.delete("/:id", deleteActive);

// activeRoutes.get("/:id/history", register);
