import { Router } from "express";
import AnswerController from "../controllers/AnswerController.js";


export const router = new Router();

router.post('/', AnswerController.create)
router.get('/', AnswerController.getAll)
