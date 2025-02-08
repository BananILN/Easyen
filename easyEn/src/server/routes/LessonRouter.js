import { Router } from "express";
import LessonController from "../controllers/LessonController.js";
import CheckRole from "../middleware/checkRoleMiddleware.js";

export const router = new Router();

router.post('/',CheckRole(2), LessonController.create)
router.get('/',LessonController.getAll)
router.get('/:id',LessonController.getOne)