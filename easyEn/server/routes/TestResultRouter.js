import { Router } from "express";
import TestResultController from "../controllers/TestResultController.js";
import CheckRole from "../middleware/checkRoleMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

export const router = new Router();

router.post('/', authMiddleware, TestResultController.createOrUpdate);
router.get('/', TestResultController.getAll);
router.get('/:id', TestResultController.getOne);
router.get('/lesson/:lessonId/user/:userId', TestResultController.getByLessonAndUser);