import { Router } from "express";
import TestResultController from "../controllers/TestResultController.js";
import CheckRole from "../middleware/checkRoleMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

export const router = new Router();

router.post('/',authMiddleware, TestResultController.create)
router.get('/', TestResultController.getAll)
