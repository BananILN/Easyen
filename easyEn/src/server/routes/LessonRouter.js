import { Router } from "express";
import LessonController from "../controllers/LessonController.js";

export const router = new Router();

router.post('/', LessonController.create)
router.get('/',LessonController.getAll)
router.get('/:id',LessonController.getOne)