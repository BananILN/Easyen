import { Router } from "express";
import UserAnswerController from "../controllers/UserAnswerController.js";
import authMiddleware from "../middleware/authMiddleware.js";

export const router = new Router();

router.post('/', authMiddleware, UserAnswerController.createOrUpdate);
router.get('/test/:testId/user/:userId', authMiddleware, UserAnswerController.getByTestAndUser);
router.delete('/test/:testId/user/:userId', authMiddleware, UserAnswerController.deleteByTestAndUser); 

export default router;