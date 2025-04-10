import { Router } from "express";
import LessonController from "../controllers/LessonController.js";
import CheckRole from "../middleware/checkRoleMiddleware.js";

export const router = new Router();

router.post('/',CheckRole("ADMIN"), LessonController.create)
router.get('/',LessonController.getAll)
router.get('/:id',LessonController.getOne)
router.put('/:id', CheckRole("ADMIN"), LessonController.update)
router.delete('/:id',CheckRole("ADMIN"), LessonController.delete)