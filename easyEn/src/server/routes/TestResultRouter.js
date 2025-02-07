import { Router } from "express";
import TestResultController from "../controllers/TestResultController.js";

export const router = new Router();

router.post('/', TestResultController.create)
router.get('/', TestResultController.getAll)
