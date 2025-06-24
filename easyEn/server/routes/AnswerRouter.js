import { Router } from "express";
import AnswerController from "../controllers/AnswerController.js";
import CheckRole from "../middleware/checkRoleMiddleware.js";

export const router = new Router();

router.post('/', CheckRole("ADMIN"), AnswerController.create);
router.get('/', AnswerController.getAll);
router.get('/:id', AnswerController.getOne);
router.put('/:id', CheckRole("ADMIN"), AnswerController.update); // Обновление ответа
router.delete('/:id', CheckRole("ADMIN"), AnswerController.delete); // Удаление ответа