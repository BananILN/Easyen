import { Router } from "express";
import QuestionController from "../controllers/QuestionController.js";

export const router = new Router();

router.post('/',QuestionController.create)
router.get('/', QuestionController.getAll)
router.get('/:id', QuestionController.getOne)
