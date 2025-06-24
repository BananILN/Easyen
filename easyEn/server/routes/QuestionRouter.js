import { Router } from "express";
import QuestionController from "../controllers/QuestionController.js";
import CheckRole from "../middleware/checkRoleMiddleware.js";

export const router = new Router();

router.post('/', CheckRole("ADMIN"), QuestionController.create);
router.get('/', QuestionController.getAll);
router.get('/:id', QuestionController.getOne);
router.put('/:id', CheckRole("ADMIN"), QuestionController.update); // Обновление вопроса
router.delete('/:id', CheckRole("ADMIN"), QuestionController.delete); // Удаление вопроса