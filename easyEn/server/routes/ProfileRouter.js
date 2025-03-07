import { Router } from "express";
import ProfileController from "../controllers/ProfileController.js";
import authMiddleware from "../middleware/authMiddleware.js";

export const router = new Router();

router.get("/",ProfileController.getAll)
router.get("/:id",authMiddleware, ProfileController.getOne)
